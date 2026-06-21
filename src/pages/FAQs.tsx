import { Layout } from "@/components/layout/Layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "How long does delivery take?", a: "Standard orders ship within 24 hours and arrive in 2–4 business days. Free shipping on all orders over $500." },
  { q: "What's covered by the warranty?", a: "Every Voltride comes with a 3-year warranty covering the motor, battery, and frame. Accessories carry a 1-year warranty." },
  { q: "Can I test ride before buying?", a: "Yes — visit our San Francisco showroom or any authorized dealer. We also offer a 30-day no-questions-asked return policy." },
  { q: "How do I service my Voltride?", a: "We offer free lifetime tech support, OTA firmware updates, and a global network of certified service partners." },
  { q: "Do you offer financing?", a: "Yes. 0% APR financing is available at checkout via Affirm and Klarna on eligible orders." },
  { q: "Is my purchase secure?", a: "Absolutely. All transactions use 256-bit SSL encryption and are PCI-DSS compliant." },
];

const FAQs = () => (
  <Layout>
    <section className="container-px mx-auto max-w-3xl py-20">
      <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2 text-center">Support</p>
      <h1 className="font-display text-5xl font-bold text-center">Frequently Asked Questions</h1>
      <p className="text-muted-foreground text-center mt-4">Can't find what you need? <a href="/contact" className="text-primary hover:underline">Contact our team</a>.</p>
      <Accordion type="single" collapsible className="mt-12">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="card-surface rounded-xl mb-3 px-5 border-0">
            <AccordionTrigger className="font-display font-semibold hover:no-underline">{f.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  </Layout>
);

export default FAQs;
