import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { site } from '../data/site';
import { useScrollLock } from '../lib/useScrollLock';
import './VideoModal.css';

type Props = {
  open: boolean;
  onClose: () => void;
};

function toEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtube.com') || parsed.hostname.includes('youtu.be')) {
      const id = parsed.hostname.includes('youtu.be') ? parsed.pathname.slice(1) : parsed.searchParams.get('v');
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (parsed.hostname.includes('vimeo.com')) {
      const id = parsed.pathname.split('/').filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
    return url;
  } catch {
    return null;
  }
}

export default function VideoModal({ open, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const isVideoFile = /\.(mp4|webm|ogg)(\?.*)?$/i.test(site.introVideoUrl);
  const embedUrl = site.introVideoUrl && !isVideoFile ? toEmbedUrl(site.introVideoUrl) : null;

  return (
    <div className="video-modal" role="dialog" aria-modal="true" aria-label="Intro video">
      <button type="button" className="video-modal__backdrop" onClick={onClose} aria-label="Close intro video" tabIndex={-1} />
      <div className="video-modal__panel">
        <button ref={closeRef} type="button" className="video-modal__close" onClick={onClose} aria-label="Close">
          <X size={20} strokeWidth={1.5} aria-hidden="true" />
        </button>

        {site.introVideoUrl && isVideoFile ? (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video className="video-modal__media" src={site.introVideoUrl} controls autoPlay playsInline />
        ) : embedUrl ? (
          <iframe
            className="video-modal__media"
            src={embedUrl}
            title="Nima Nabizada — intro video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="video-modal__placeholder">
            <span className="video-modal__mark" aria-hidden="true">
              N
            </span>
            <h2 className="video-modal__title">The intro is on its way</h2>
            <p className="video-modal__copy">
              No video is connected yet. Add your intro link to{' '}
              <code>src/data/site.ts</code> (<code>introVideoUrl</code>) and it will play right here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
