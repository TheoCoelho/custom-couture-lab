// src/pages/Login.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { isEmail } from "@/lib/validators";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmail(email)) {
      toast.error("E-mail inválido.");
      return;
    }
    if (!password) {
      toast.error("Informe a senha.");
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      toast.success("Bem-vindo!");
      navigate("/");
    } catch (e: any) {
      toast.error(e?.message ?? "Falha ao entrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Entrar</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</Button>
            <p className="text-sm text-muted-foreground">
              Não tem conta? <Link className="underline" to="/register">Criar conta</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
