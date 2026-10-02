import type { ServiceFaq, ServiceSection } from "./service-pages.ts";

export type LocalContentDepth = {
  h1: string;
  title: string;
  description: string;
  intro: string[];
  sections: ServiceSection[];
  faqs: ServiceFaq[];
};
