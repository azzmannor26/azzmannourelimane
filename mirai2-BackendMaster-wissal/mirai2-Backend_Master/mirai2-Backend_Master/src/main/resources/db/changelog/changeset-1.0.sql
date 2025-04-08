-- Insert Users with hashed passwords
INSERT INTO users (id, username, password, email, departement, role) VALUES
                                                                         (1, 'superviseur1', crypt('password1', gen_salt('bf')), 'superviseur1@example.com', 'Engineering', 'SUPERVISEUR'),
                                                                         (2, 'stagiaire1', crypt('password2', gen_salt('bf')), 'stagiaire1@example.com', 'Software Development', 'STAGIAIRE'),
                                                                         (3, 'rh1', crypt('password3', gen_salt('bf')), 'rh1@example.com', 'HR', 'RH'),
                                                                         (4, 'superviseur2', crypt('password4', gen_salt('bf')), 'superviseur2@example.com', 'IT', 'SUPERVISEUR'),
                                                                         (5, 'stagiaire2', crypt('password5', gen_salt('bf')), 'stagiaire2@example.com', 'Data Science', 'STAGIAIRE');

-- Insert RH
INSERT INTO rh (users_id) VALUES
    (3);

-- Insert Superviseurs
INSERT INTO superviseur (users_id, poste) VALUES
                                              (1, 'Team Lead'),
                                              (4, 'Manager');

-- Insert Stagiaires
INSERT INTO stagiaire (users_id, phone_number, profile_image, city, superviseur_id) VALUES
                                                                                        (2, '1234567890', 'profile1.jpg', 'City A', 1),
                                                                                        (5, '0987654321', 'profile2.jpg', 'City B', 4);

-- Insert Taches
INSERT INTO tache (id, description, date_echeance, statut, stagiaire_id, superviseur_id) VALUES
                                                                                             (1, 'Develop a feature module', '2025-01-31', 'pending', 2, 1),
                                                                                             (2, 'Prepare project documentation', '2025-02-15', 'completed', 2, 1),
                                                                                             (3, 'Analyze dataset', '2025-03-01', 'inprogress', 5, 4);

-- Insert Stages
INSERT INTO stage (id, date_debut, date_fin, sujet, departement, is_paid, stipend, location, contract_status, stagiaire_id, superviseur_id) VALUES
                                                                                                                                                (1, '2025-01-01', '2025-06-30', 'Initial development phase', 'Engineering', TRUE, '1000 USD', 'Remote', 'Signed', 2, 1),
                                                                                                                                                (2, '2025-07-01', '2025-12-31', 'Research and analysis phase', 'Data Science', FALSE, '0 USD', 'On-site', 'Pending', 5, 4);

-- Insert Rapports
INSERT INTO rapport (id, contenu, nom, type, stagiaire_id, superviseur_id) VALUES
                                                                               (1, 'Phase 1 Report Content', 'Phase 1 Report', 'rejected', 2, 1),
                                                                               (2, 'Phase 2 Report Content', 'Phase 2 Report', 'accepted', 5, 4);

-- Insert Candidatures
INSERT INTO candidature (id, cv, degree, lettremotivation, dureedestage, typeinternship, statut, users_id) VALUES
                                                                                                               (1, 'CV Path 1', 'Bachelor', 'Motivation Letter Content 1', '6 months', 'FULL_TIME', 'accepted', 2),
                                                                                                               (2, 'CV Path 2', 'Master', 'Motivation Letter Content 2', '1 year', 'PART_TIME', 'rejected', 5);

-- Insert Notifications
INSERT INTO notification (id, contenu, date_envoi, status, users_id) VALUES
                                                                         (1, 'Welcome, superviseur1!', '2025-01-01 09:00:00', 'unread', 1),
                                                                         (2, 'Your candidature has been approved!', '2025-02-01 10:00:00', 'unread', 2),
                                                                         (3, 'New task assigned!', '2025-02-15 15:00:00', 'unread', 5);

-- Insert Availability
INSERT INTO availability (start_date, end_date, description, superviseur_id) VALUES
                                                                                 ('2025-01-01', '2025-01-15', 'Superviseur is available for project review during this period.', 1),
                                                                                 ('2025-02-01', '2025-02-10', 'Superviseur will oversee team training during this time.', 1),
                                                                                 ('2025-03-01', '2025-03-15', 'Superviseur is available for mentoring.', 4),
                                                                                 ('2025-04-01', '2025-04-10', 'Superviseur will conduct performance evaluations.', 4);

-- Insert Certifications
INSERT INTO certifications (id, stagiaire_id, rh_id, status, certificate_path) VALUES
                                                                                   (1, 2, 3, 'accepted', 'certificates/certificate1.pdf'),
                                                                                   (2, 5, 3, 'rejected', 'certificates/certificate2.pdf');