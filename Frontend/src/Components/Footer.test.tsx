import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders PublicVoice brand and quick links', () => {
    render(<Footer currentLang="English" />);
    expect(screen.getByText('PublicVoice')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /services/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
  });

  it('has accessible social links', () => {
    render(<Footer currentLang="English" />);
    expect(screen.getByLabelText('Facebook')).toBeInTheDocument();
  });
});
