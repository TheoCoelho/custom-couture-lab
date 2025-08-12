// src/pages/Register.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { isEmail, isStrongPassword, validateCPF, onlyDigits } from "@/lib/validators";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Form = {
  full_name: string;
  username: string;
  email: string;
  password: string;
  confirm: string;
  birth_date: string;
  cpf: string;
  phone: string;
};

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Form>({
    full_name: "",
    username: "",
    email: "",
    password: "",
    confirm: "",
    birth_date: "",
    cpf: "",
    phone: "",
  });

  const onChange = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((s) => ({ ...s, [k]: e.target.value }));
  };

  const validate = (): string | null => {
    if (!form.full_name.trim()) return "Informe seu nome completo.";
    if (!form.username.trim()) return "Informe um username.";
    if (!isEmail(form.email)) return "E-mail inválido.";
    if (!isStrongPassword(form.password)) return "Senha muito curta (mín. 6 caracteres).";
    if (form.password !== form.confirm) return "As senhas não conferem.";
    if (form.cpf && !validateCPF(form.cpf)) return "CPF inválido.";
    // birth_date e phone são opcionais
    return null;
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    setLoading(true);
    try {
      const payload = {
        email: form.email.trim(),
        password: form.password,
        full_name: form.full_name.trim(),
        username: form.username.trim(),
        birth_date: form.birth_date || null,
        cpf: form.cpf ? onlyDigits(form.cpf) : null,
        phone: form.phone ? onlyDigits(form.phone) : null,
      };

      const { emailConfirmationSent } = await signUp(payload);

      if (emailConfirmationSent) {
        toast.success("Conta criada! Verifique seu e-mail para confirmar o cadastro.");
        navigate("/login");
      } else {
        toast.success("Conta criada e ativa! Você já pode entrar.");
        navigate("/login");
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Erro ao registrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Criar conta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="full_name">Nome completo</Label>
              <Input id="full_name" value={form.full_name} onChange={onChange("full_name")} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={form.username} onChange={onChange("username")} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={form.email} onChange={onChange("email")} required />
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" value={form.password} onChange={onChange("password")} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm">Confirmar senha</Label>
                <Input id="confirm" type="password" value={form.confirm} onChange={onChange("confirm")} required />
              </div>
            </div>
            <div className="grid gap-2 md:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor="birth_date">Nascimento</Label>
                <Input id="birth_date" type="date" value={form.birth_date} onChange={onChange("birth_date")} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input id="cpf" placeholder="000.000.000-00" value={form.cpf} onChange={onChange("cpf")} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" placeholder="(00) 00000-0000" value={form.phone} onChange={onChange("phone")} />
              </div>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Criando..." : "Criar conta"}
            </Button>

            <p className="text-sm text-muted-foreground">
              Já tem conta? <Link className="underline" to="/login">Entrar</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
