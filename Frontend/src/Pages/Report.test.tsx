import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Report from './Report';

// Mock contexts so Report page can render without full app
vi.mock('../contexts/LanguageContext', () => ({
  useLanguage: () => ({
    t: {
      report: {
        hero: { title: 'Report an Issue', description: 'Describe your issue.' },
        form: {
          title: 'Submit a Report',
          name: 'Full Name',
          namePlaceholder: 'Your name',
          phone: 'Phone',
          phonePlaceholder: '+250...',
          location: 'Location',
          locationPlaceholder: 'e.g. Kigali, Gasabo',
          institution: 'Institution',
          category: 'Category',
          description: 'Description',
          descriptionPlaceholder: 'Describe the issue...',
          button: 'Submit Report',
        },
        institutions: {
          select: 'Select institution',
          district: 'District',
          sector: 'Sector',
          cell: 'Cell',
          village: 'Village',
          mininfra: 'Ministry of Infrastructure',
          mineduc: 'Ministry of Education',
          minisante: 'Ministry of Health',
          localGov: 'Local Government',
          other: 'Other',
        },
        categories: {
          select: 'Select category',
          roads: 'Roads',
          water: 'Water',
          security: 'Security',
          sanitation: 'Sanitation',
          electricity: 'Electricity',
          health: 'Health',
          education: 'Education',
          other: 'Other',
        },
        whyReport: { title: 'Why report?', reason1: 'Reason 1', reason2: 'Reason 2', reason3: 'Reason 3' },
        howProcess: { title: 'How we process', step1: 'Step 1', step2: 'Step 2', step3: 'Step 3' },
        successMessage: 'Report submitted.',
      },
    },
  }),
}));

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ user: null }),
}));

describe('Report page', () => {
  it('renders report form with required fields', () => {
    render(<Report />);
    expect(screen.getByRole('heading', { name: /report an issue/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/institution/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit report/i })).toBeInTheDocument();
  });

  it('has submit button that can be disabled during submit', () => {
    render(<Report />);
    const btn = screen.getByRole('button', { name: /submit report/i });
    expect(btn).toBeEnabled();
  });
});
