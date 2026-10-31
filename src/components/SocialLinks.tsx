import { Github, Instagram, Linkedin, Mail } from 'lucide-react';
import { site } from '../data/site';
import './SocialLinks.css';

const icons = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  mail: Mail,
};

type Props = {
  tone?: 'dark' | 'light';
  label?: string;
};

export default function SocialLinks({ tone = 'light', label = 'Social profiles' }: Props) {
  return (
    <ul className={`socials socials--${tone}`} aria-label={label}>
      {site.socials.map((social) => {
        const Icon = icons[social.icon];
        const href = social.icon === 'mail' && site.email ? `mailto:${site.email}` : social.href;

        return (
          <li key={social.label}>
            {href ? (
              <a
                className="socials__link"
                href={href}
                target={social.icon === 'mail' ? undefined : '_blank'}
                rel={social.icon === 'mail' ? undefined : 'noopener noreferrer'}
                aria-label={social.label}
              >
                <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
                <span>{social.label}</span>
              </a>
            ) : (
              <span
                className="socials__link socials__link--empty"
                title={`Add your ${social.label} URL in src/data/site.ts`}
              >
                <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
                <span>{social.label}</span>
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
