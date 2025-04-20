import { isInEU } from "./utils";

export default {
  tiers: [
    {
      name: "Starter",
      price: "$9",
      description: "For personal use and quick file sharing.",
      features: [
        // "Quick-Share files of any size",
        <span><b>Unlimited transfers</b></span>,
        "Up to 200GB per transfer",
        "Files expire after 14 days",
        "Send files by email",
        isInEU() ? "Proudly hosted in the EU 🇪🇺" : "Track views and downloads",
      ],
    },
    {
      name: "Pro",
      price: "$19",
      description: "For power users & professionals.",
      features: [
        // "Quick-Share files of any size",
        <span><b>Unlimited transfers</b></span>,
        <span>Up to <b>1TB</b> per transfer</span>,
        <span>Files stay up for <b>365 days</b></span>,
        <span>Send files to <b>200 emails</b></span>,
        "Priority support",
        isInEU() ? "Proudly hosted in the EU 🇪🇺" : "Track views and downloads",
        <span><b>Custom</b> branding<span className="ms-1.5 px-1.5 py-0.5 text-xs font-semibold bg-primary rounded-full">Coming Soon</span></span>,
        <span><b>Custom</b> domain<span className="ms-1.5 px-1.5 py-0.5 text-xs font-semibold bg-primary rounded-full">Coming Soon</span></span>,
        // <span>Custom subdomain for links</span>,
        // "Password protect files",
      ],
      featured: true,
    }
  ]
}