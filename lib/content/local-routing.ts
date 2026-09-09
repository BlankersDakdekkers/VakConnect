import { getLocalMainPage, getLocalStaticParams, getLocalSubservicePage } from "./local-service-pages.ts";
import { getServiceSubPage, serviceSubSlugs } from "./service-pages.ts";

export type ResolvedPublicRoute =
  | { type: "local"; localPage: NonNullable<ReturnType<typeof getLocalMainPage>> }
  | { type: "service-sub"; serviceSubPage: NonNullable<ReturnType<typeof getServiceSubPage>> };

export function getPublicServiceStaticParams() {
  const serviceParams = serviceSubSlugs.map(({ vakgebied, subdienst }) => ({ vakgebied, slug: [subdienst] }));
  return [...serviceParams, ...getLocalStaticParams()];
}

export function resolvePublicServiceRoute(vakgebied: string, slug: string[]): ResolvedPublicRoute | null {
  if (slug.length === 1) {
    const [secondSegment] = slug;
    const localMainPage = getLocalMainPage(vakgebied, secondSegment);

    if (localMainPage) {
      return { type: "local", localPage: localMainPage };
    }

    const serviceSubPage = getServiceSubPage(vakgebied, secondSegment);
    if (serviceSubPage) {
      return { type: "service-sub", serviceSubPage };
    }

    return null;
  }

  if (slug.length === 2) {
    const [subdienst, stad] = slug;
    const localSubPage = getLocalSubservicePage(vakgebied, subdienst, stad);

    if (localSubPage) {
      return { type: "local", localPage: localSubPage };
    }
  }

  return null;
}
