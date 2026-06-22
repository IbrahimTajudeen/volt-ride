import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name, email: form.email,
      subject: form.subject || null, message: form.message,
    });
    setLoading(false);
    if (error) return toast.error("Couldn't send message. Try again.");
    toast.success("Message sent! We'll be in touch within 4 hours.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <Layout>
      <section className="container-px mx-auto max-w-7xl py-16 grid lg:grid-cols-2 gap-12">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Get in touch</p>
          <h1 className="font-display text-5xl font-bold">We're here to help.</h1>
          <p className="mt-4 text-muted-foreground">Questions about a ride, an order, or service? Our team replies within 4 hours.</p>
          <ul className="mt-10 space-y-5">
            <li className="flex gap-3"><Mail className="h-5 w-5 text-primary mt-0.5" /><div><div className="font-semibold">hello@voltride.com</div><div className="text-sm text-muted-foreground">For general inquiries</div></div></li>
            <li className="flex gap-3"><Phone className="h-5 w-5 text-primary mt-0.5" /><div><div className="font-semibold">+1 (800) 555-0142</div><div className="text-sm text-muted-foreground">Mon–Sat, 9am–8pm PT</div></div></li>
            <li className="flex gap-3"><MapPin className="h-5 w-5 text-primary mt-0.5" /><div><div className="font-semibold">240 Mission St, San Francisco</div><div className="text-sm text-muted-foreground">Visit our flagship showroom</div></div></li>
          </ul>
        </div>
        <form onSubmit={submit} className="card-surface rounded-2xl p-8 space-y-4">
          <input required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} placeholder="Full name" className="w-full h-11 px-3 rounded-md bg-background border border-border focus:border-primary outline-none" />
          <input required type="email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} placeholder="Email" className="w-full h-11 px-3 rounded-md bg-background border border-border focus:border-primary outline-none" />
          <input value={form.subject} onChange={e=>setForm({...form, subject: e.target.value})} placeholder="Subject" className="w-full h-11 px-3 rounded-md bg-background border border-border focus:border-primary outline-none" />
          <textarea required rows={5} value={form.message} onChange={e=>setForm({...form, message: e.target.value})} placeholder="How can we help?" className="w-full p-3 rounded-md bg-background border border-border focus:border-primary outline-none resize-none" />
          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send message"}
          </Button>
        </form>
      </section>
    </Layout>
  );
};

export default Contact;