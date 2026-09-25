// Must match the fixed enums in ostati-app's job_reports table
// (job_reports_reason_check / job_reports_status_check, 0034).
export const REASON_LABEL: Record<string, string> = {
  provider_no_show: 'ოსტატი არ გამოცხადდა',
  customer_no_show: 'მომხმარებელი არ გამოცხადდა',
  work_not_completed: 'სამუშაო არ დასრულებულა',
  inappropriate_behavior: 'შეუფერებელი ქცევა',
  incorrect_information: 'არასწორი ინფორმაცია',
  // chat_reports (0095)
  spam: 'სპამი',
  harassment: 'შეურაცხყოფა/შევიწროება',
  inappropriate_content: 'შეუფერებელი შინაარსი',
  scam: 'თაღლითობა',
  other: 'სხვა',
};

export const STATUS_LABEL: Record<string, string> = {
  open: 'ღია',
  reviewing: 'განხილვაში',
  resolved: 'გადაწყვეტილი',
  dismissed: 'უარყოფილი',
};

export const STATUSES = ['open', 'reviewing', 'resolved', 'dismissed'] as const;
