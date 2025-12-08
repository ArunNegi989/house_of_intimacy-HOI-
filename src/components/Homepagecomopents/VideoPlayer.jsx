import React from 'react';

const VideoPlayer = () => {
  return (
    <div className="container-fluid p-0">
      <video
        className="w-100"
        src="https://flute-theme.myshopify.com/cdn/shop/videos/c/vp/4239b423129a40fbbcb670b41c10e21b/4239b423129a40fbbcb670b41c10e21b.HD-1080p-7.2Mbps-50361676.mp4?v=0"
        autoPlay
        muted
        loop
        playsInline
        style={{ display: 'block', width: '100%', height: 'auto' }}
      />
    </div>
  );
};

export default VideoPlayer;
