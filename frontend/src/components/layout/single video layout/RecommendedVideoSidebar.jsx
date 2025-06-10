import React from "react";
import {
  Column,
  PlaylistCard,
  RecommendedVideoCard,
  Row,
  VideoCard,
} from "../../../index";

const RecommendedVideosSidebar = ({ videos }) => {
  return (
    <>
      {/* Desktop: Sidebar Layout (hidden on medium/small screens) */}
      <aside className="hidden w-80 lg:flex flex-col gap-1">
        {videos.slice(0, 5).map((video) => (
          <RecommendedVideoCard key={video.id} video={video} />
        ))}
      </aside>

      {/* Mobile/Tablet: Grid Layout (shown on medium/small screens) */}

      <Row customRowClass="lg:hidden">
        <Column customColClass="col-span-12 sm570:col-span-6 lg:col-span-4">
          <VideoCard />
        </Column>
        <Column customColClass="col-span-12 sm570:col-span-6 lg:col-span-4">
          <VideoCard />
        </Column>
        <Column customColClass="col-span-12 sm570:col-span-6 lg:col-span-4">
          <VideoCard />
        </Column>
        <Column customColClass="col-span-12 sm570:col-span-6 lg:col-span-4">
          <PlaylistCard />
        </Column>
      </Row>
    </>
  );
};

export default RecommendedVideosSidebar;
