// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";
import type { Profile } from "@/types/profile";

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (args: {
    email: string;
    password: string;
    full_name: string;
    username: string;
    birth_date?: string | null;
    cpf?: string | null;
    phone?: string | null;
  }) => Promise<{ emailConfirmationSent: boolean }>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (patch: Partial<Profile>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  // carrega sessão atual
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  // carrega profile quando usuário muda
  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    refreshProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const refreshProfile = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("[profiles] select error:", error);
      setProfile(null);
      return;
    }
    setProfile(data as Profile);
  };

  const signUp: AuthContextType["signUp"] = async ({
    email,
    password,
    full_name,
    username,
    birth_date = null,
    cpf = null,
    phone = null,
  }) => {
    // 1) cria usuário no Auth
    const { data: su, error: suErr } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: full_name.trim(),
          username: username.trim(),
        },
      },
    });
    if (suErr) throw suErr;

    const authUser = su.user; // pode ser null se exigir confirmação de email
    const emailConfirmationSent = !!su?.session === false;

    // 2) cria profile (se já houver user.id) — se confirmar email for exigido,
    //    esse passo ficará para o primeiro login após confirmação.
    if (authUser?.id) {
      const { error: pfErr } = await supabase.from("profiles").insert({
        id: authUser.id,
        full_name: full_name.trim(),
        username: username.trim(),
        birth_date,
        cpf,
        phone,
      });
      if (pfErr && pfErr.code !== "23505") {
        // ignora unique violation se já existir (caso de reexecução)
        throw pfErr;
      }
    }

    return { emailConfirmationSent };
  };

  const signIn: AuthContextType["signIn"] = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateProfile: AuthContextType["updateProfile"] = async (patch) => {
    if (!user) throw new Error("Sem usuário autenticado.");
    const payload = { ...patch, id: user.id };
    const { error } = await supabase.from("profiles").upsert(payload);
    if (error) throw error;
    await refreshProfile();
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      profile,
      loading,
      signUp,
      signIn,
      signOut,
      refreshProfile,
      updateProfile,
    }),
    [user, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider />");
  return ctx;
};
