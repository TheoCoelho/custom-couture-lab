// src/pages/Register.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import bcrypt from "bcryptjs";

function onlyDigits(v: string) {
  return (v || "").replace(/\D/g, "");
}

// Validação básica de CPF (checksum)
function isValidCPF(raw: string) {
  const str = onlyDigits(raw);
  if (str.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(str)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(str[i]) * (10 - i);
  let d1 = (sum * 10) % 11;
  if (d1 === 10) d1 = 0;
  if (d1 !== parseInt(str[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(str[i]) * (11 - i);
  let d2 = (sum * 10) % 11;
  if (d2 === 10) d2 = 0;
  if (d2 !== parseInt(str[10])) return false;

  return true;
}

export default function Register() {
  const [form, setForm] = useState({
    full_name: "",
    username: "",
    email: "",
    phone: "",
    birth_date: "",
    cpf: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);

  const onChange =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((s) => ({ ...s, [k]: e.target.value }));

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    // Validações rápidas
    if (!form.full_name.trim()) return toast.error("Informe o nome completo.");
    if (!form.username.trim()) return toast.error("Informe o username.");
    if (!form.email.trim()) return toast.error("Informe o e-mail.");
    if (!form.password || form.password.length < 6)
      return toast.error("Senha deve ter pelo menos 6 caracteres.");
    if (form.password !== form.confirm)
      return toast.error("As senhas não coincidem.");
    if (!form.birth_date) return toast.error("Informe a data de nascimento.");
    if (!isValidCPF(form.cpf)) return toast.error("CPF inválido.");

    setLoading(true);
    try {
      // Hash da senha (apenas registro; não é login)
      const password_hash = await bcrypt.hash(form.password, 10);

      const payload = {
        full_name: form.full_name.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        phone: onlyDigits(form.phone),
        birth_date: form.birth_date, // 'YYYY-MM-DD'
        cpf: onlyDigits(form.cpf),
        password_hash,
        source: "app",
        marketing_consent: false,
        notes: null,
      };

      const { error } = await supabase
        .from("user_registrations")
        .insert(payload);

      if (error) {
        const dup =
          /duplicate key|unique|already exists|violates unique/i.test(
            error.message
          );
        if (dup) {
          // Tenta identificar o campo conflitado
          if (/email/i.test(error.message))
            return toast.error("E-mail já cadastrado.");
          if (/username/i.test(error.message))
            return toast.error("Username já em uso.");
          if (/cpf/i.test(error.message)) return toast.error("CPF já cadastrado.");
          return toast.error("Registro duplicado.");
        }
        console.error(error);
        return toast.error("Erro ao salvar cadastro.");
      }

      toast.success("Cadastro enviado com sucesso!");
      setForm({
        full_name: "",
        username: "",
        email: "",
        phone: "",
        birth_date: "",
        cpf: "",
        password: "",
        confirm: "",
      });
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Erro ao enviar cadastro.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center px-6">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <Link
            to="/"
            className="text-3xl font-bold text-gray-800 hover:text-purple-600 transition-colors"
          >
            StyleCraft
          </Link>
          <p className="text-gray-600 mt-2">Crie seu cadastro</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Registrar</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="full_name">Nome completo</Label>
                <Input
                  id="full_name"
                  value={form.full_name}
                  onChange={onChange("full_name")}
                  placeholder="Seu nome completo"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={form.username}
                  onChange={onChange("username")}
                  placeholder="ex.: kaikejb"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={onChange("email")}
                  placeholder="seu@email.com"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="phone">Celular</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={onChange("phone")}
                  placeholder="(00) 90000-0000"
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="birth_date">Data de nascimento</Label>
                <Input
                  id="birth_date"
                  type="date"
                  value={form.birth_date}
                  onChange={onChange("birth_date")}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={form.cpf}
                  onChange={onChange("cpf")}
                  placeholder="000.000.000-00"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={onChange("password")}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="confirm">Confirmar senha</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={form.confirm}
                  onChange={onChange("confirm")}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  disabled={loading}
                />
              </div>

              <div className="md:col-span-2">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  disabled={loading}
                >
                  {loading ? "Enviando..." : "Cadastrar"}
                </Button>
              </div>

              <div className="md:col-span-2 text-center">
                <p className="text-gray-600">
                  Já tem uma conta?{" "}
                  <Link to="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                    Faça login
                  </Link>
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  <Link to="/" className="hover:text-gray-700">
                    Voltar ao início
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
