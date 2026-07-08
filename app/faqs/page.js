import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationBar from '@/components/NotificationBar'
import Accordion from '@/components/Accordion'

const FAQS = [
  { title: 'How does the tier/XP loyalty system work?', content: 'You earn XP on every purchase, plus for email signup, following us on social media, and referring friends. As your XP grows you climb through 5 tiers, each unlocking bigger rewards, early access to drops, and weekend XP boosts.' },
  { title: 'Where is my order?', content: 'Once your order ships, UK orders get a tracking number via Evri that you can view in your account under Orders. International orders currently ship untracked.' },
  { title: 'What sizing do you use?', content: 'Apparel sizing runs XXS to 3XL. Check our Size Guide for UK/EU/US conversions before ordering.' },
  { title: 'Can I return or exchange an item?', content: 'UK orders can be returned within 14 days. International orders are also accepted, with the customer covering return postage. Size exchanges are available.' },
  { title: 'How do referral rewards work?', content: "Share your unique referral link — your friend gets 15% off (20% if you're an athlete), and you earn matching commission credited to your balance, redeemable as a discount code once you hit the threshold." },
  { title: 'How do I become a BLXCKSHARK Athlete?', content: "Our athlete program is invite-only. We look for people regularly training and creating content tagging @blxckshark.co or #blxckshark. Visit our Become an Athlete page for more." },
]

export default function FAQsPage() {
  return (
    <>
      <NotificationBar />
      <Header />

      <main className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <h1 className="font-display mb-8 text-3xl font-bold uppercase tracking-tight">FAQs</h1>
          <Accordion items={FAQS} />
        </div>
      </main>

      <Footer />
    </>
  )
}
