export type Applicant = {
    id: number;
    fullName: string;
    email: string;
    status: string;
    createdAt: string;
};

export type Interview = {
    id: number;
    date: string;
    notes: string | null;
    applicants: { id: number; fullName: string } | null;
};