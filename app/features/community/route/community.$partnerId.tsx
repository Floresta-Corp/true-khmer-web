import type { Route } from "project-types/community/route/+types/community.$partnerId";
import { useState } from "react";
import { Link, useLoaderData } from "react-router";
import { Button } from "~/components/ui/button";
import BigFlower from "~/components/icons/bigFlower";
import FullFlower from "~/components/icons/fullFlower";
import { PartnerHeader } from "../components/detail/partner-header";
import { PartnerInfoCards } from "../components/detail/partner-info-cards";
import { PartnerLightbox } from "../components/detail/partner-lightbox";
import { PartnerOnlinePresence } from "../components/detail/partner-online-presence";
import { PartnerPhotoGallery } from "../components/detail/partner-photo-gallery";
import { communityDetailLoader } from "../services/community-detail.loader";

export const loader = communityDetailLoader;

export function meta({ data }: Route.MetaArgs) {
  return [
    { title: `${data?.partner?.name || "Partner"} - True Khmer` },
    { name: "description", content: "Learn more about our partner" },
  ];
}

export default function CommunityPartnerDetail() {
  const { partner, photos } = useLoaderData<typeof communityDetailLoader>();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const name = partner.name || "";

  const lightboxImages = [
    ...(partner.logo ? [{ src: partner.logo, alt: `${name} logo` }] : []),
    ...photos.map((photo) => ({ src: photo.url, alt: `${name} gallery image` })),
  ];

  const openLogoLightbox = () => {
    if (partner.logo) {
      setLightboxIndex(0);
      setLightboxOpen(true);
    }
  };

  const openGalleryLightbox = (photoIndex: number) => {
    setLightboxIndex(photoIndex + (partner.logo ? 1 : 0));
    setLightboxOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-background px-4 py-8 sm:px-6 sm:py-12 md:px-10 lg:py-16 xl:px-0">
      <div className="pointer-events-none absolute top-[8%] right-0 z-0 rotate-180 text-blue-600">
        <BigFlower width={492} height={478} />
      </div>
      <div className="pointer-events-none absolute top-[5%] left-50 z-0 hidden text-blue-600 md:block">
        <FullFlower width={162} height={158} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-12">
          <PartnerHeader
            logo={partner.logo}
            name={name}
            bio={partner.bio}
            tier={partner.package}
            onLogoClick={openLogoLightbox}
          />
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="space-y-12 lg:col-span-2">
            <PartnerInfoCards
              name={name}
              description={partner.description}
              sectorActivity={partner.sectorActivity}
              createdAt={partner.createdAt}
            />
            <PartnerPhotoGallery
              name={name}
              photos={photos}
              onPhotoClick={openGalleryLightbox}
            />
          </div>

          <div className="space-y-8 lg:col-span-1">
            <PartnerOnlinePresence
              website={partner.website}
              facebook={partner.facebook}
              linkedin={partner.linkedin}
              telegram={partner.telegram}
            />

            <div className="rounded-xl bg-gradient-to-br from-blue-600 to-[#243d95] p-6 text-white">
              <h3 className="mb-4 text-xl font-bold">Interested in Partnership?</h3>
              <p className="mb-6 text-white/90">
                Join us right now and become part of the True Khmer community.
              </p>
              <Button asChild variant="secondary" className="w-full">
                <Link to="/registration/partner-registration">Join Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <PartnerLightbox
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        images={lightboxImages}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
      />
    </div>
  );
}
