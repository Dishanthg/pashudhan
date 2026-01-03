import type { Language } from "../types";

export type TranslationStrings = {
    back: string; add: string; submit: string; cancel: string; edit: string; delete: string; update: string; search: string; save: string; confirm: string; close: string;
    species_cattle: string; species_buffalo: string;
    header_title: string; header_settings: string; header_logout: string;
    footer_copyright: string; footer_policy: string; footer_powered_by: string;
    login_title: string; login_subtitle: string; login_username_placeholder: string; login_password_placeholder: string; login_button: string; login_logging_in: string; login_forgot_password: string; login_signup_prompt: string; login_signup_link: string; login_error_credentials: string;
    signup_title: string; signup_subtitle: string; signup_username_placeholder: string; signup_email_placeholder: string; signup_password_placeholder: string; signup_button: string; signup_creating_account: string; signup_login_prompt: string; signup_login_link: string; signup_error_all_fields: string; signup_error_invalid_email: string;
    forgot_password_title: string; forgot_password_subtitle: string; forgot_password_email_placeholder: string; forgot_password_button: string; forgot_password_success: string; forgot_password_back_to_login: string;
    welcome_back: string; dashboard_subtitle: string; dashboard_total_herd: string; dashboard_total_cattle: string; dashboard_total_buffalo: string; dashboard_my_herd: string; dashboard_animal_id: string;
    feature_register_title: string; feature_register_desc: string; feature_library_title: string; feature_library_desc: string; feature_reports_title: string; feature_reports_desc: string; feature_vets_title: string; feature_vets_desc: string;
    reg_title: string; reg_tag_id_label: string; reg_species_label: string; reg_dob_label: string; reg_weight_label: string; reg_weight_placeholder: string; reg_vaccination_label: string; reg_vaccination_placeholder: string;
    reg_ai_suggestion_title: string; reg_ai_suggestion_desc: string; reg_ai_suggestion: string; reg_ai_autofilled: string; reg_ai_confidence: string; reg_ai_reasoning: string; reg_ai_use_different_photo: string;
    reg_breed_label: string; reg_breed_placeholder: string; reg_button: string;
    file_upload_click: string; file_upload_drag: string; file_upload_types: string; file_upload_or: string; file_upload_camera: string;
    loader_analyzing: string;
    library_title: string; library_search_placeholder: string; library_no_breeds_found: string; library_no_breeds_suggestion: string;
    library_modal_characteristics: string; library_modal_health_husbandry: string; library_modal_lifespan: string; library_modal_diet: string; library_modal_diseases: string; library_modal_performance: string; library_modal_temperament: string; library_modal_milk_yield: string; library_modal_draught_capacity: string;
    reports_title: string; reports_subtitle: string; reports_milk_tracker_title: string; reports_milk_tracker_subtitle: string; reports_add_entry_title: string; reports_edit_entry_title: string; reports_date_label: string; reports_liters_label: string; reports_liters_placeholder: string; reports_add_button: string; reports_update_button: string; reports_production_log_title: string; reports_liters_unit: string; reports_production_trend_title: string; reports_production_trend_subtitle: string; reports_no_data: string; reports_total_predictions: string; reports_most_common_breed: string; reports_avg_confidence: string;
    reports_alert_delete_confirm: string; reports_alert_date_exists: string; reports_alert_invalid_input: string;
    vets_title: string; vets_subtitle: string; vets_finding_location: string; vets_location_error: string; vets_get_directions: string;
    profile_title: string; profile_breed: string; profile_tag_id: string; profile_species: string; profile_reg_date: string; profile_dob: string; profile_weight: string; profile_vaccination: string;
    nav_dashboard: string; nav_library: string; nav_reports: string; nav_vets: string; nav_register: string; nav_about: string;
    settings_title: string; settings_profile_section: string; settings_appearance_section: string; settings_about_section: string; settings_change_password: string; settings_change_password_title: string; settings_current_password: string; settings_new_password: string; settings_confirm_new_password: string; settings_password_change_success: string; settings_theme_label: string; settings_language_label: string; settings_about_description: string; settings_about_problem_statement: string;
    error_no_breed_identified: string; error_network: string; error_unexpected: string; error_image_size: string; error_image_type: string; error_tagId_required: string; error_breed_required: string; error_dob_required: string; error_dob_future: string; error_weight_required: string; error_weight_invalid: string; error_passwords_no_match: string; error_password_too_short: string;
    hero_title: string; hero_description: string; stats_title: string; pashu_aadhaar: string; vaccinations: string; breeding: string; naip_iv: string; external_links_title: string; visit_link: string;
    about_mission_title: string; about_mission_desc: string; about_dev_title: string; about_dev_desc: string; about_comp_title: string; about_comp_desc: string;
    nav_vaccination: string;
    vacc_title: string;
    vacc_subtitle: string;
    vacc_add_entry: string;
    vacc_herd_label: string;
    vacc_name_label: string;
    vacc_date_label: string;
    vacc_due_date_label: string;
    vacc_dose_label: string;
    vacc_notes_label: string;
    vacc_status_upcoming: string;
    vacc_status_due_soon: string;
    vacc_status_overdue: string;
    vacc_status_completed: string;
    vacc_no_records: string;
    vacc_vaccine_placeholder: string;
    vacc_notes_placeholder: string;
};

const en: TranslationStrings = {
    back: 'Back', add: 'Add', submit: 'Submit', cancel: 'Cancel', edit: 'Edit', delete: 'Delete', update: 'Update', search: 'Search', save: 'Save', confirm: 'Confirm', close: 'Close',
    species_cattle: 'Cattle', species_buffalo: 'Buffalo',
    header_title: 'Pashudhan', header_settings: 'Settings', header_logout: 'Logout',
    footer_copyright: 'Pashudhan. All rights reserved.', footer_policy: 'Privacy Policy', footer_powered_by: 'Powered by',
    login_title: 'Welcome to Pashudhan', login_subtitle: 'Sign in to manage your livestock.', login_username_placeholder: 'Username', login_password_placeholder: 'Password', login_button: 'Log In', login_logging_in: 'Logging In...', login_forgot_password: 'Forgot Password?', login_signup_prompt: "Don't have an account?", login_signup_link: 'Sign Up', login_error_credentials: 'Username and password are required.',
    signup_title: 'Join Pashudhan', signup_subtitle: 'Create your account to get started.', signup_username_placeholder: 'Username', signup_email_placeholder: 'Email', signup_password_placeholder: 'Password', signup_button: 'Sign Up', signup_creating_account: 'Creating Account...', signup_login_prompt: 'Already have an account?', signup_login_link: 'Log In', signup_error_all_fields: 'All fields are required.', signup_error_invalid_email: 'Please enter a valid email address.',
    forgot_password_title: 'Forgot Password', forgot_password_subtitle: 'Enter your email for a reset link.', forgot_password_email_placeholder: 'Email Address', forgot_password_button: 'Reset Password', forgot_password_success: 'If an account exists, a link has been sent.', forgot_password_back_to_login: 'Back to Login',
    welcome_back: 'Welcome Back!', dashboard_subtitle: 'Your central hub for livestock management.', dashboard_total_herd: 'Livestock Owners', dashboard_total_cattle: 'Total Cattle', dashboard_total_buffalo: 'Total Buffalo', dashboard_my_herd: 'My Herd', dashboard_animal_id: 'ID',
    feature_register_title: 'Register New Animal', feature_register_desc: 'Add a new cattle or buffalo.', feature_library_title: 'Explore Breed Library', feature_library_desc: 'Browse Indian breeds info.', feature_reports_title: 'Production Reports', feature_reports_desc: 'Track milk and health.', feature_vets_title: 'Veterinary Services', feature_vets_desc: 'Locate nearby clinics.',
    reg_title: 'Register New Animal', reg_tag_id_label: 'Tag ID', reg_species_label: 'Species', reg_dob_label: 'Date of Birth', reg_weight_label: 'Weight (kg)', reg_weight_placeholder: 'e.g., 350', reg_vaccination_label: 'Vaccinations', reg_vaccination_placeholder: 'Enter records...',
    reg_ai_suggestion_title: 'AI Breed ID', reg_ai_suggestion_desc: 'Upload photo for breed suggestion.', reg_ai_suggestion: 'AI Suggestion:', reg_ai_autofilled: '(Auto-filled)', reg_ai_confidence: 'Confidence', reg_ai_reasoning: 'Reasoning', reg_ai_use_different_photo: 'Use different photo',
    reg_breed_label: 'Breed', reg_breed_placeholder: 'e.g., Gir, Murrah', reg_button: 'Register Animal',
    file_upload_click: 'Click to upload', file_upload_drag: 'or drag and drop', file_upload_types: 'PNG, JPG (Max 4MB)', file_upload_or: 'OR', file_upload_camera: 'Take Photo',
    loader_analyzing: 'Analyzing image...',
    library_title: 'Breed Library', library_search_placeholder: 'Search breeds...', library_no_breeds_found: 'No breeds found.', library_no_breeds_suggestion: 'Try adjusting your search.',
    library_modal_characteristics: 'Characteristics', library_modal_health_husbandry: 'Health', library_modal_lifespan: 'Lifespan', library_modal_diet: 'Diet', library_modal_diseases: 'Diseases', library_modal_performance: 'Performance', library_modal_temperament: 'Temperament', library_modal_milk_yield: 'Milk Yield', library_modal_draught_capacity: 'Draught',
    reports_title: 'Reports & Analytics', reports_subtitle: 'Gain insights into performance.', reports_milk_tracker_title: 'Milk Production', reports_milk_tracker_subtitle: 'Log daily yield.', reports_add_entry_title: 'Add Entry', reports_edit_entry_title: 'Edit Entry', reports_date_label: 'Date', reports_liters_label: 'Liters', reports_liters_placeholder: 'e.g., 12.5', reports_add_button: 'Add Entry', reports_update_button: 'Update', reports_production_log_title: 'Production Log', reports_liters_unit: 'liters', reports_production_trend_title: 'Trend', reports_production_trend_subtitle: 'Showing last {count} days.', reports_no_data: 'No data available.', reports_total_predictions: 'Total AI Predictions', reports_most_common_breed: 'Most Common Breed', reports_avg_confidence: 'Avg Confidence',
    reports_alert_delete_confirm: 'Delete this entry?', reports_alert_date_exists: 'Entry exists for this date.', reports_alert_invalid_input: 'Invalid input.',
    vets_title: 'Veterinary Services', vets_subtitle: 'Find clinics nearby.', vets_finding_location: 'Locating...', vets_location_error: 'Could not get location.', vets_get_directions: 'Get Directions',
    profile_title: 'Animal Profile', profile_breed: 'Breed', profile_tag_id: 'Tag ID', profile_species: 'Species', profile_reg_date: 'Registered', profile_dob: 'Birth Date', profile_weight: 'Weight', profile_vaccination: 'Vaccination',
    nav_dashboard: 'Home', nav_library: 'Library', nav_reports: 'Reports', nav_vets: 'Vets', nav_register: 'Add', nav_about: 'About Us',
    settings_title: 'Settings', settings_profile_section: 'Profile', settings_appearance_section: 'Theme', settings_about_section: 'About', settings_change_password: 'Change Password', settings_change_password_title: 'New Password', settings_current_password: 'Current', settings_new_password: 'New', settings_confirm_new_password: 'Confirm', settings_password_change_success: 'Password changed.', settings_theme_label: 'Theme', settings_language_label: 'Language', settings_about_description: 'Breed Identifier App', settings_about_problem_statement: 'Helping farmers manage livestock.',
    error_no_breed_identified: 'Breed not identified.', error_network: 'Network error.', error_unexpected: 'Unexpected error.', error_image_size: 'Image too large.', error_image_type: 'Invalid format.', error_tagId_required: 'Tag ID required.', error_breed_required: 'Breed required.', error_dob_required: 'Birth date required.', error_dob_future: 'Invalid birth date.', error_weight_required: 'Weight required.', error_weight_invalid: 'Invalid weight.', error_passwords_no_match: 'Mismatch.', error_password_too_short: 'Too short.',
    hero_title: 'National Digital Livestock Mission', hero_description: 'The Livestock sector has a unique combination of being the backbone of the rural livelihood while also showing consistent growth and export potential.', stats_title: 'Key Statistics', pashu_aadhaar: 'Pashu Aadhaar', vaccinations: 'Vaccinations', breeding: 'Breeding', naip_iv: 'NAIP IV', external_links_title: 'External Links', visit_link: 'Visit Link',
    about_mission_title: 'Our Mission & Vision', 
    about_mission_desc: 'At Pashudhan, we believe that the backbone of our nation—the farmers—deserve the finest tools modern technology can provide. Our mission is to bridge the digital divide by bringing advanced Computer Vision and Predictive Analytics to every cattle shed in India. We aim to transform traditional livestock management into a data-driven, high-yield operation that secures the livelihood of millions while ensuring the welfare of our precious cattle.',
    about_dev_title: 'Development & Engineering', 
    about_dev_desc: 'Pashudhan is a prestige innovation project born in the labs of BMS Institute of Technology & Management. Developed by a dedicated group of engineering students, this application represents the intersection of social responsibility and technical mastery. Under the expert mentorship and guidance of our esteemed faculty members, we have engineered a solution that solves real-world agricultural complexities with production-grade Artificial Intelligence.',
    about_comp_title: 'Modern Innovation vs. Legacy Systems', 
    about_comp_desc: 'Traditional government portals often struggle with slow manual entry and complex interfaces. Pashudhan redefines the standard by providing a "Scan-and-Register" workflow that is 5x faster. By integrating real-time health alerts, offline-first data synchronization, and instant breed identification via the Gemini API, we provide an ecosystem that empowers farmers rather than burdening them with paperwork.',
    nav_vaccination: 'Vaccination',
    vacc_title: 'Vaccination Records',
    vacc_subtitle: 'Manage health schedules for your herd.',
    vacc_add_entry: 'Record Vaccination',
    vacc_herd_label: 'Select Animal',
    vacc_name_label: 'Vaccine Name',
    vacc_date_label: 'Vaccination Date',
    vacc_due_date_label: 'Next Due Date',
    vacc_dose_label: 'Dose Number',
    vacc_notes_label: 'Veterinarian / Notes',
    vacc_status_upcoming: 'Upcoming',
    vacc_status_due_soon: 'Due Soon',
    vacc_status_overdue: 'Overdue',
    vacc_status_completed: 'Completed',
    vacc_no_records: 'No vaccination records found for this animal.',
    vacc_vaccine_placeholder: 'e.g., FMD, HS, BQ',
    vacc_notes_placeholder: 'Enter doctor name or hospital...',
};

const hi: TranslationStrings = {
    ...en,
    header_title: 'पशुधन',
    nav_vaccination: 'टीकाकरण',
    vacc_title: 'टीकाकरण रिकॉर्ड',
    vacc_subtitle: 'अपने पशुओं के स्वास्थ्य कार्यक्रम का प्रबंधन करें।',
};

const kn: TranslationStrings = {
    ...en,
    header_title: 'ಪಶುಧನ',
    nav_vaccination: 'ಲಸಿಕೆ',
    vacc_title: 'ಲಸಿಕೆ ದಾಖಲೆಗಳು',
    vacc_subtitle: 'ನಿಮ್ಮ ಹಿಂಡಿನ ಆರೋಗ್ಯ ವೇಳಾಪಟ್ಟಿಗಳನ್ನು ನಿರ್ವಹಿಸಿ.',
};

export const translations: Record<Language, TranslationStrings> = {
    en,
    hi,
    kn
};