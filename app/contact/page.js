import { SITE_NAME } from '@/lib/site';
import { publicApiUrl } from '@/lib/api';
import { ContactForm } from '@/components/ContactForm';

export const metadata = {
  title: 'Contact',
  description: `Suggest a Bangladeshi startup for ${SITE_NAME}, or send us a message.`,
  alternates: { canonical: '/contact' },
};

export default async function ContactPage({ searchParams }) {
  const { topic } = await searchParams;
  const initialTopic = topic === 'suggestion' ? 'suggestion' : 'contact';

  return (
    <div className="mx-auto max-w-7xl px-5 pt-14 sm:px-8 sm:pt-20">
      <header className="max-w-4xl">
        <p className="label">Contact</p>
        <h1 className="h-display mt-6 text-balance">Suggest a startup, or say hello</h1>
        <p className="mt-6 max-w-[62ch] font-serif text-xl leading-relaxed text-muted">
          Know a Bangladeshi startup that shut down and should be documented? Tell us about it. For corrections to a case study, use the “Spotted an error?” form at the end of that case study.
        </p>
      </header>

      <div className="mt-14 max-w-[68ch]">
        <ContactForm apiUrl={publicApiUrl()} initialTopic={initialTopic} />
      </div>
    </div>
  );
}
