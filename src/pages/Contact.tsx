import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";

const Contact = () => (
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
      <form onSubmit={(e) => { e.preventDefault(); toast.success("Message sent!"); (e.target as HTMLFormElement).reset(); }}
        className="card-surface rounded-2xl p-8 space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <input required placeholder="First name" className="h-11 px-3 rounded-md bg-background border border-border focus:border-primary outline-none" />
          <input required placeholder="Last name" className="h-11 px-3 rounded-md bg-background border border-border focus:border-primary outline-none" />
        </div>
        <input required type="email" placeholder="Email" className="w-full h-11 px-3 rounded-md bg-background border border-border focus:border-primary outline-none" />
        <input placeholder="Subject" className="w-full h-11 px-3 rounded-md bg-background border border-border focus:border-primary outline-none" />
        <textarea required rows={5} placeholder="How can we help?" className="w-full p-3 rounded-md bg-background border border-border focus:border-primary outline-none resize-none" />
        <Button type="submit" variant="hero" size="lg" className="w-full">Send message</Button>
      </form>
    </section>
  </Layout>
);

export default Contact;
