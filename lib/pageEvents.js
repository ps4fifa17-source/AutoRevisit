/** CTA and engagement events counted as customer actions across the dashboard. */
export const ACTION_EVENTS = [
  "whatsapp_click",
  "call_click",
  "lead_submit",
  "finance_click",
  "test_drive_click",
  "message_click",
  "enquiry_message_click",
  "first_car_costs_click",
  "arrange_viewing_click",
  "premium_contact_click",
  "family_viewing_click",
  "value_enquiry_click",
  "book_viewing_click",
];

export function isActionEvent(eventType) {
  return ACTION_EVENTS.includes(String(eventType || "").toLowerCase());
}

export function countActionEvents(events = []) {
  return events.filter((event) => isActionEvent(event.event_type)).length;
}
