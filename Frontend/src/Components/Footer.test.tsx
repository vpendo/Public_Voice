/** Footer renders links and brand for EN/RW */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders PublicVoice brand and quick links', () => {
    render(
      <MemoryRouter>
        <Footer currentLang="English" />
      </MemoryRouter>
    );
    expect(screen.getByText('PublicVoice')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /our services/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^contact us$/i })).toBeInTheDocument();
  });

  it('has accessible social links', () => {
    render(
      <MemoryRouter>
        <Footer currentLang="English" />
      </MemoryRouter>
    );
    expect(screen.getByLabelText('Facebook')).toBeInTheDocument();
  });
});
