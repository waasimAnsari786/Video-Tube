import React from "react";
import {
  Column,
  PlaylistCard,
  RecommendedPlaylistCard,
  RecommendedVideoCard,
  Row,
} from "../../index";

const RecommendedVideosSidebar = ({ videos }) => {
  return (
    <>
      {/* Desktop: Sidebar Layout (hidden on medium/small screens) */}
      <aside className="hidden xl:flex flex-col gap-2">
        {videos.map((video) => (
          <RecommendedVideoCard key={video.title} video={video} />
        ))}
        <RecommendedPlaylistCard />
      </aside>

      {/* Mobile/Tablet: Grid Layout (shown on medium/small screens) */}

      <Row customRowClass="xl:hidden">
        {videos.map((video) => (
          <Column
            customColClass="col-span-12 sm570:col-span-6 lg:col-span-4"
            key={video.title}
          >
            <RecommendedVideoCard video={video} />
          </Column>
        ))}
        <Column customColClass="col-span-12 sm570:col-span-6 lg:col-span-4">
          <RecommendedPlaylistCard />
        </Column>
      </Row>
    </>
  );
};

export default RecommendedVideosSidebar;
