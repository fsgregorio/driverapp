-- Script para inserir dados mock no Supabase
-- Execute este script no SQL Editor do Supabase Dashboard
-- 
-- IMPORTANTE: Este script requer que os usuários sejam criados PRIMEIRO!
-- 
-- PASSO 1: Crie os usuários em Authentication > Users > Add User:
--   - carlos.silva@teste.com / senha123
--   - ana.santos@teste.com / senha123
--   - roberto.oliveira@teste.com / senha123
--   - mariana.costa@teste.com / senha123
--   - joao.lima@teste.com / senha123
--   - patricia.mendes@teste.com / senha123
--   - fernando.alves@teste.com / senha123
--   - aluno@teste.com / senha123
--
-- PASSO 2: Execute este script SQL
-- 
-- O script irá buscar os UUIDs reais dos usuários criados e inserir os dados

-- ============================================
-- PARTE 1: Criar função auxiliar para buscar UUID por email
-- ============================================
CREATE OR REPLACE FUNCTION get_user_id_by_email(user_email TEXT) RETURNS UUID AS $$
DECLARE
  user_uuid UUID;
BEGIN
  SELECT id INTO user_uuid
  FROM auth.users
  WHERE email = user_email
  LIMIT 1;
  
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'Usuário com email % não encontrado. Crie o usuário primeiro em Authentication > Users', user_email;
  END IF;
  
  RETURN user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PARTE 2: Inserir perfis de instrutores
-- ============================================
-- O script busca automaticamente os UUIDs dos usuários pelos emails

INSERT INTO profiles (id, user_type, name, phone, photo_url, profile_complete, cnh, vehicle, premium, response_time, home_service, car_types, specialties, class_types, women_only)
VALUES
  -- Instrutor 1: Carlos Silva
  (get_user_id_by_email('carlos.silva@teste.com'), 'instructor', 'Carlos Silva', '(83) 99999-0001', '/imgs/instructors/1.png', true, 'Categoria B', 'Fiat Mobi', true, 'Responde em até 2h', true, ARRAY['Manual', 'Automático'], ARRAY['Carro Manual', 'Carro Automático', 'Moto'], ARRAY['Rua', 'Baliza', 'Rodovia', 'Geral'], false),
  
  -- Instrutor 2: Ana Paula Santos
  (get_user_id_by_email('ana.santos@teste.com'), 'instructor', 'Ana Paula Santos', '(83) 99999-0002', '/imgs/instructors/5.png', true, 'Categoria B', 'Fiat Mobi', true, 'Responde em até 1h', true, ARRAY['Automático'], ARRAY['Carro Automático', 'Defensiva'], ARRAY['Rua', 'Baliza', 'Geral'], true),
  
  -- Instrutor 3: Roberto Oliveira
  (get_user_id_by_email('roberto.oliveira@teste.com'), 'instructor', 'Roberto Oliveira', '(83) 99999-0003', '/imgs/instructors/2.png', true, 'Categoria A e B', 'Hyundai HB20', true, 'Responde em até 3h', true, ARRAY['Manual'], ARRAY['Carro Manual', 'Moto'], ARRAY['Rua', 'Baliza', 'Rodovia'], false),
  
  -- Instrutor 4: Mariana Costa
  (get_user_id_by_email('mariana.costa@teste.com'), 'instructor', 'Mariana Costa', '(83) 99999-0004', '/imgs/instructors/6.png', true, 'Categoria B', 'Volkswagen Gol', true, 'Responde em até 30min', true, ARRAY['Manual', 'Automático'], ARRAY['Carro Automático', 'Carro Manual', 'Defensiva'], ARRAY['Rua', 'Baliza', 'Rodovia', 'Geral'], false),
  
  -- Instrutor 5: João Pedro Lima
  (get_user_id_by_email('joao.lima@teste.com'), 'instructor', 'João Pedro Lima', '(83) 99999-0005', '/imgs/instructors/3.png', true, 'Categoria B', 'Chevrolet Onix', false, 'Responde em até 2h', true, ARRAY['Manual'], ARRAY['Carro Manual'], ARRAY['Rua', 'Baliza'], false),
  
  -- Instrutor 6: Patricia Mendes
  (get_user_id_by_email('patricia.mendes@teste.com'), 'instructor', 'Patricia Mendes', '(83) 99999-0006', '/imgs/instructors/7.png', true, 'Categoria B', 'Volkswagen Gol', false, 'Responde em até 1h', true, ARRAY['Automático'], ARRAY['Carro Automático', 'Defensiva'], ARRAY['Rua', 'Baliza', 'Geral'], false),
  
  -- Instrutor 7: Fernando Alves
  (get_user_id_by_email('fernando.alves@teste.com'), 'instructor', 'Fernando Alves', '(83) 99999-0007', '/imgs/instructors/4.png', true, 'Categoria B', 'Fiat Uno', true, 'Responde em até 2h', false, ARRAY['Manual', 'Automático'], ARRAY['Carro Manual', 'Carro Automático'], ARRAY['Rua', 'Baliza', 'Rodovia', 'Geral'], false)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  photo_url = EXCLUDED.photo_url,
  profile_complete = EXCLUDED.profile_complete,
  cnh = EXCLUDED.cnh,
  vehicle = EXCLUDED.vehicle,
  premium = EXCLUDED.premium,
  response_time = EXCLUDED.response_time,
  home_service = EXCLUDED.home_service,
  car_types = EXCLUDED.car_types,
  specialties = EXCLUDED.specialties,
  class_types = EXCLUDED.class_types,
  women_only = EXCLUDED.women_only;

-- ============================================
-- PARTE 3: Inserir registros na tabela instructors
-- ============================================
INSERT INTO instructors (id, rating, total_reviews, total_classes, price_per_class, price_own_vehicle, home_service_price, location, availability, description, available)
VALUES
  (get_user_id_by_email('carlos.silva@teste.com'), 4.8, 127, 37, 110.00, 90.00, 20.00,
   '{"state": "PB", "city": "João Pessoa", "neighborhood": "Manaíra", "fullAddress": "João Pessoa - PB"}'::jsonb,
   '{"weeklySchedule": {"1": {"start": "08:00", "end": "12:00"}, "2": {"start": "08:00", "end": "12:00"}, "3": {"start": "08:00", "end": "12:00"}, "4": {"start": "08:00", "end": "12:00"}, "5": {"start": "08:00", "end": "12:00"}, "6": {"start": "08:00", "end": "18:00"}}, "blockedDates": [], "customSchedule": {}}'::jsonb,
   'Instrutor experiente com mais de 10 anos de ensino. Paciente e dedicado.', true),
   
  (get_user_id_by_email('ana.santos@teste.com'), 4.8, 89, 6, 100.00, 90.00, NULL,
   '{"state": "PB", "city": "João Pessoa", "neighborhood": "Manaíra", "fullAddress": "João Pessoa - PB"}'::jsonb,
   '{"weeklySchedule": {"1": {"start": "09:00", "end": "17:00"}, "2": {"start": "09:00", "end": "17:00"}, "3": {"start": "09:00", "end": "17:00"}, "4": {"start": "09:00", "end": "17:00"}, "5": {"start": "09:00", "end": "17:00"}}, "blockedDates": [], "customSchedule": {}}'::jsonb,
   'Especialista em ensino para iniciantes. Método prático e eficiente.', true),
   
  (get_user_id_by_email('roberto.oliveira@teste.com'), 5.0, 203, 42, 120.00, 100.00, 30.00,
   '{"state": "PB", "city": "João Pessoa", "neighborhood": "Estados", "fullAddress": "João Pessoa - PB"}'::jsonb,
   '{"weeklySchedule": {"1": {"start": "08:00", "end": "18:00"}, "2": {"start": "08:00", "end": "18:00"}, "3": {"start": "08:00", "end": "18:00"}, "4": {"start": "08:00", "end": "18:00"}, "5": {"start": "08:00", "end": "18:00"}, "6": {"start": "08:00", "end": "12:00"}}, "blockedDates": [], "customSchedule": {}}'::jsonb,
   'Instrutor certificado com foco em aprovação rápida no exame.', true),
   
  (get_user_id_by_email('mariana.costa@teste.com'), 4.5, 156, 26, 100.00, NULL, 20.00,
   '{"state": "PB", "city": "João Pessoa", "neighborhood": "Mangabeira", "fullAddress": "João Pessoa - PB"}'::jsonb,
   '{"weeklySchedule": {"1": {"start": "07:00", "end": "19:00"}, "2": {"start": "07:00", "end": "19:00"}, "3": {"start": "07:00", "end": "19:00"}, "4": {"start": "07:00", "end": "19:00"}, "5": {"start": "07:00", "end": "19:00"}, "6": {"start": "08:00", "end": "16:00"}}, "blockedDates": [], "customSchedule": {}}'::jsonb,
   'Instrutora premiada com excelente taxa de aprovação.', true),
   
  (get_user_id_by_email('joao.lima@teste.com'), 0.0, 0, 0, 90.00, 80.00, 30.00,
   '{"state": "PB", "city": "João Pessoa", "neighborhood": "Centro", "fullAddress": "João Pessoa - PB"}'::jsonb,
   '{"weeklySchedule": {"1": {"start": "10:00", "end": "16:00"}, "2": {"start": "10:00", "end": "16:00"}, "3": {"start": "10:00", "end": "16:00"}, "4": {"start": "10:00", "end": "16:00"}, "5": {"start": "10:00", "end": "16:00"}}, "blockedDates": [], "customSchedule": {}}'::jsonb,
   'Instrutor experiente com metodologia moderna e tecnologia.', true),
   
  (get_user_id_by_email('patricia.mendes@teste.com'), 4.1, 67, 32, 75.00, 60.00, 20.00,
   '{"state": "PB", "city": "João Pessoa", "neighborhood": "Bessa", "fullAddress": "João Pessoa - PB"}'::jsonb,
   '{"weeklySchedule": {"1": {"start": "08:00", "end": "17:00"}, "2": {"start": "08:00", "end": "17:00"}, "3": {"start": "08:00", "end": "17:00"}, "4": {"start": "08:00", "end": "17:00"}, "5": {"start": "08:00", "end": "17:00"}, "6": {"start": "09:00", "end": "13:00"}}, "blockedDates": [], "customSchedule": {}}'::jsonb,
   'Instrutora especializada em aulas para mulheres.', true),
   
  (get_user_id_by_email('fernando.alves@teste.com'), 4.6, 145, 18, 100.00, NULL, NULL,
   '{"state": "PB", "city": "João Pessoa", "neighborhood": "Cabo Branco", "fullAddress": "João Pessoa - PB"}'::jsonb,
   '{"weeklySchedule": {"1": {"start": "08:00", "end": "18:00"}, "2": {"start": "08:00", "end": "18:00"}, "3": {"start": "08:00", "end": "18:00"}, "4": {"start": "08:00", "end": "18:00"}, "5": {"start": "08:00", "end": "18:00"}, "6": {"start": "08:00", "end": "14:00"}}, "blockedDates": [], "customSchedule": {}}'::jsonb,
   'Instrutor com mais de 15 anos de experiência.', true)
ON CONFLICT (id) DO UPDATE SET
  rating = EXCLUDED.rating,
  total_reviews = EXCLUDED.total_reviews,
  total_classes = EXCLUDED.total_classes,
  price_per_class = EXCLUDED.price_per_class,
  price_own_vehicle = EXCLUDED.price_own_vehicle,
  home_service_price = EXCLUDED.home_service_price,
  location = EXCLUDED.location,
  availability = EXCLUDED.availability,
  description = EXCLUDED.description,
  available = EXCLUDED.available;

-- ============================================
-- PARTE 4: Inserir disponibilidade dos instrutores
-- ============================================
INSERT INTO instructor_availability (instructor_id, day_of_week, start_time, end_time, blocked_dates, custom_schedule)
VALUES
  -- Carlos Silva
  (get_user_id_by_email('carlos.silva@teste.com'), 1, '08:00', '12:00', ARRAY[]::DATE[], '{}'::jsonb),
  (get_user_id_by_email('carlos.silva@teste.com'), 2, '08:00', '12:00', ARRAY[]::DATE[], '{}'::jsonb),
  (get_user_id_by_email('carlos.silva@teste.com'), 3, '08:00', '12:00', ARRAY[]::DATE[], '{}'::jsonb),
  (get_user_id_by_email('carlos.silva@teste.com'), 4, '08:00', '12:00', ARRAY[]::DATE[], '{}'::jsonb),
  (get_user_id_by_email('carlos.silva@teste.com'), 5, '08:00', '12:00', ARRAY[]::DATE[], '{}'::jsonb),
  (get_user_id_by_email('carlos.silva@teste.com'), 6, '08:00', '18:00', ARRAY[]::DATE[], '{}'::jsonb),
  
  -- Ana Paula Santos
  (get_user_id_by_email('ana.santos@teste.com'), 1, '09:00', '17:00', ARRAY[]::DATE[], '{}'::jsonb),
  (get_user_id_by_email('ana.santos@teste.com'), 2, '09:00', '17:00', ARRAY[]::DATE[], '{}'::jsonb),
  (get_user_id_by_email('ana.santos@teste.com'), 3, '09:00', '17:00', ARRAY[]::DATE[], '{}'::jsonb),
  (get_user_id_by_email('ana.santos@teste.com'), 4, '09:00', '17:00', ARRAY[]::DATE[], '{}'::jsonb),
  (get_user_id_by_email('ana.santos@teste.com'), 5, '09:00', '17:00', ARRAY[]::DATE[], '{}'::jsonb),
  
  -- Roberto Oliveira
  (get_user_id_by_email('roberto.oliveira@teste.com'), 1, '08:00', '18:00', ARRAY[]::DATE[], '{}'::jsonb),
  (get_user_id_by_email('roberto.oliveira@teste.com'), 2, '08:00', '18:00', ARRAY[]::DATE[], '{}'::jsonb),
  (get_user_id_by_email('roberto.oliveira@teste.com'), 3, '08:00', '18:00', ARRAY[]::DATE[], '{}'::jsonb),
  (get_user_id_by_email('roberto.oliveira@teste.com'), 4, '08:00', '18:00', ARRAY[]::DATE[], '{}'::jsonb),
  (get_user_id_by_email('roberto.oliveira@teste.com'), 5, '08:00', '18:00', ARRAY[]::DATE[], '{}'::jsonb),
  (get_user_id_by_email('roberto.oliveira@teste.com'), 6, '08:00', '12:00', ARRAY[]::DATE[], '{}'::jsonb),
  
  -- Mariana Costa
  (get_user_id_by_email('mariana.costa@teste.com'), 1, '07:00', '19:00', ARRAY[]::DATE[], '{}'::jsonb),
  (get_user_id_by_email('mariana.costa@teste.com'), 2, '07:00', '19:00', ARRAY[]::DATE[], '{}'::jsonb),
  (get_user_id_by_email('mariana.costa@teste.com'), 3, '07:00', '19:00', ARRAY[]::DATE[], '{}'::jsonb),
  (get_user_id_by_email('mariana.costa@teste.com'), 4, '07:00', '19:00', ARRAY[]::DATE[], '{}'::jsonb),
  (get_user_id_by_email('mariana.costa@teste.com'), 5, '07:00', '19:00', ARRAY[]::DATE[], '{}'::jsonb),
  (get_user_id_by_email('mariana.costa@teste.com'), 6, '08:00', '16:00', ARRAY[]::DATE[], '{}'::jsonb),
  
  -- João Pedro Lima
  (get_user_id_by_email('joao.lima@teste.com'), 1, '10:00', '16:00', ARRAY[]::DATE[], '{}'::jsonb),
  (get_user_id_by_email('joao.lima@teste.com'), 2, '10:00', '16:00', ARRAY[]::DATE[], '{}'::jsonb),
  (get_user_id_by_email('joao.lima@teste.com'), 3, '10:00', '16:00', ARRAY[]::DATE[], '{}'::jsonb),
  (get_user_id_by_email('joao.lima@teste.com'), 4, '10:00', '16:00', ARRAY[]::DATE[], '{}'::jsonb),
  (get_user_id_by_email('joao.lima@teste.com'), 5, '10:00', '16:00', ARRAY[]::DATE[], '{}'::jsonb),
  
  -- Patricia Mendes
  (get_user_id_by_email('patricia.mendes@teste.com'), 1, '08:00', '17:00', ARRAY[]::DATE[], '{}'::jsonb),
  (get_user_id_by_email('patricia.mendes@teste.com'), 2, '08:00', '17:00', ARRAY[]::DATE[], '{}'::jsonb),
  (get_user_id_by_email('patricia.mendes@teste.com'), 3, '08:00', '17:00', ARRAY[]::DATE[], '{}'::jsonb),
  (get_user_id_by_email('patricia.mendes@teste.com'), 4, '08:00', '17:00', ARRAY[]::DATE[], '{}'::jsonb),
  (get_user_id_by_email('patricia.mendes@teste.com'), 5, '08:00', '17:00', ARRAY[]::DATE[], '{}'::jsonb),
  (get_user_id_by_email('patricia.mendes@teste.com'), 6, '09:00', '13:00', ARRAY[]::DATE[], '{}'::jsonb),
  
  -- Fernando Alves
  (get_user_id_by_email('fernando.alves@teste.com'), 1, '08:00', '18:00', ARRAY[]::DATE[], '{}'::jsonb),
  (get_user_id_by_email('fernando.alves@teste.com'), 2, '08:00', '18:00', ARRAY[]::DATE[], '{}'::jsonb),
  (get_user_id_by_email('fernando.alves@teste.com'), 3, '08:00', '18:00', ARRAY[]::DATE[], '{}'::jsonb),
  (get_user_id_by_email('fernando.alves@teste.com'), 4, '08:00', '18:00', ARRAY[]::DATE[], '{}'::jsonb),
  (get_user_id_by_email('fernando.alves@teste.com'), 5, '08:00', '18:00', ARRAY[]::DATE[], '{}'::jsonb),
  (get_user_id_by_email('fernando.alves@teste.com'), 6, '08:00', '14:00', ARRAY[]::DATE[], '{}'::jsonb)
ON CONFLICT (instructor_id, day_of_week) DO UPDATE SET
  start_time = EXCLUDED.start_time,
  end_time = EXCLUDED.end_time,
  blocked_dates = EXCLUDED.blocked_dates,
  custom_schedule = EXCLUDED.custom_schedule;

-- ============================================
-- PARTE 5: Criar perfil de aluno de teste
-- ============================================
-- O script busca automaticamente o UUID do aluno pelo email

INSERT INTO profiles (id, user_type, name, phone, photo_url, profile_complete)
VALUES
  (get_user_id_by_email('aluno@teste.com'), 'student', 'Francisco Gregório', '(83) 99999-9999', '/imgs/users/image.png', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  photo_url = EXCLUDED.photo_url,
  profile_complete = EXCLUDED.profile_complete;

-- ============================================
-- PARTE 6: Inserir classes de exemplo
-- ============================================
-- NOTA: Estas classes usam os UUIDs gerados acima
-- Você precisará ajustar as datas para datas futuras válidas

INSERT INTO classes (student_id, instructor_id, date, time, duration, status, price, class_types, car, location, pickup_type, payment_status, created_at)
VALUES
  -- 2 Aulas Agendadas
  (get_user_id_by_email('aluno@teste.com'), get_user_id_by_email('carlos.silva@teste.com'), '2026-01-18', '10:00', 60, 'agendada', 120.00, ARRAY['Baliza'], 'Honda Civic 2020',
   '{"fullAddress": "Rua das Flores, 123 - João Pessoa - PB", "state": "PB", "city": "João Pessoa", "neighborhood": "Manaíra", "address": "Rua das Flores, 123"}'::jsonb,
   'vai_local', 'pago', '2026-01-12T10:00:00Z'::timestamptz),
   
  (get_user_id_by_email('aluno@teste.com'), get_user_id_by_email('ana.santos@teste.com'), '2026-01-20', '14:00', 60, 'confirmada', 150.00, ARRAY['Rua', 'Baliza'], 'Toyota Corolla 2021',
   '{"fullAddress": "Av. Epitácio Pessoa, 1000 - João Pessoa - PB", "state": "PB", "city": "João Pessoa", "neighborhood": "Manaíra", "address": "Av. Epitácio Pessoa, 1000"}'::jsonb,
   'busca_casa', 'pago', '2026-01-13T08:00:00Z'::timestamptz),
  
  -- 3 Aulas Pendentes de Aceite
  (get_user_id_by_email('aluno@teste.com'), get_user_id_by_email('roberto.oliveira@teste.com'), '2026-01-22', '09:00', 60, 'pendente_aceite', 100.00, ARRAY['Baliza'], 'Fiat Palio 2019',
   '{"fullAddress": "Rua Principal, 500 - João Pessoa - PB", "state": "PB", "city": "João Pessoa", "neighborhood": "Estados", "address": "Rua Principal, 500"}'::jsonb,
   'vai_local', 'pendente', '2026-01-15T10:30:00Z'::timestamptz),
   
  (get_user_id_by_email('aluno@teste.com'), get_user_id_by_email('mariana.costa@teste.com'), '2026-01-25', '16:00', 60, 'pendente_aceite', 180.00, ARRAY['Rodovia'], 'Volkswagen Golf 2022',
   '{"fullAddress": "Av. João Câncio, 1500 - João Pessoa - PB", "state": "PB", "city": "João Pessoa", "neighborhood": "Mangabeira", "address": "Av. João Câncio, 1500"}'::jsonb,
   'busca_casa', 'pendente', '2026-01-16T08:15:00Z'::timestamptz),
   
  (get_user_id_by_email('aluno@teste.com'), get_user_id_by_email('joao.lima@teste.com'), '2026-01-24', '11:30', 60, 'pendente_aceite', 110.00, ARRAY['Rua'], 'Chevrolet Onix 2020',
   '{"fullAddress": "Rua do Comércio, 200 - João Pessoa - PB", "state": "PB", "city": "João Pessoa", "neighborhood": "Centro", "address": "Rua do Comércio, 200"}'::jsonb,
   'vai_local', 'pendente', '2026-01-17T14:20:00Z'::timestamptz),
  
  -- 1 Aula Pendente de Pagamento (status seria 'agendada' mas payment_status = 'pendente')
  (get_user_id_by_email('aluno@teste.com'), get_user_id_by_email('carlos.silva@teste.com'), '2026-01-19', '15:00', 60, 'agendada', 120.00, ARRAY['Geral'], 'Honda Civic 2020',
   '{"fullAddress": "Rua das Flores, 123 - João Pessoa - PB", "state": "PB", "city": "João Pessoa", "neighborhood": "Manaíra", "address": "Rua das Flores, 123"}'::jsonb,
   'vai_local', 'pendente', '2026-01-14T11:00:00Z'::timestamptz),
  
  -- 1 Aula Concluída (para histórico)
  (get_user_id_by_email('aluno@teste.com'), get_user_id_by_email('carlos.silva@teste.com'), '2026-01-10', '16:00', 60, 'concluida', 120.00, ARRAY['Geral'], 'Honda Civic 2020',
   '{"fullAddress": "Rua das Flores, 123 - João Pessoa - PB", "state": "PB", "city": "João Pessoa", "neighborhood": "Manaíra", "address": "Rua das Flores, 123"}'::jsonb,
   'vai_local', 'pago', '2026-01-03T08:00:00Z'::timestamptz),
   
  (get_user_id_by_email('aluno@teste.com'), get_user_id_by_email('roberto.oliveira@teste.com'), '2026-01-08', '09:00', 60, 'concluida', 100.00, ARRAY['Baliza'], 'Fiat Palio 2019',
   '{"fullAddress": "Rua Principal, 500 - João Pessoa - PB", "state": "PB", "city": "João Pessoa", "neighborhood": "Estados", "address": "Rua Principal, 500"}'::jsonb,
   'vai_local', 'pago', '2026-01-01T10:00:00Z'::timestamptz),
   
  -- 1 Aula Cancelada
  (get_user_id_by_email('aluno@teste.com'), get_user_id_by_email('mariana.costa@teste.com'), '2026-01-06', '10:00', 60, 'cancelada', 180.00, ARRAY['Rodovia'], 'Volkswagen Golf 2022',
   '{"fullAddress": "Av. João Câncio, 1500 - João Pessoa - PB", "state": "PB", "city": "João Pessoa", "neighborhood": "Mangabeira", "address": "Av. João Câncio, 1500"}'::jsonb,
   'busca_casa', 'reembolsado', '2025-12-29T08:00:00Z'::timestamptz);

-- ============================================
-- FIM DO SCRIPT
-- ============================================
-- 
-- INSTRUÇÕES PARA USO:
-- 
-- 1. Acesse o Supabase Dashboard: https://supabase.com/dashboard/project/odmwardaafuvbusmrseq
-- 2. Vá em SQL Editor
-- 3. Cole este script completo
-- 4. Execute o script
-- 
-- IMPORTANTE: 
-- - ANTES de executar este script, você DEVE criar os usuários em Authentication > Users > Add User:
--   Instrutores:
--     - carlos.silva@teste.com / senha123
--     - ana.santos@teste.com / senha123
--     - roberto.oliveira@teste.com / senha123
--     - mariana.costa@teste.com / senha123
--     - joao.lima@teste.com / senha123
--     - patricia.mendes@teste.com / senha123
--     - fernando.alves@teste.com / senha123
--   Aluno:
--     - aluno@teste.com / senha123
-- - O script busca automaticamente os UUIDs dos usuários pelos emails
-- - Se algum usuário não for encontrado, o script retornará um erro informando qual email está faltando
-- 
-- Para verificar os dados inseridos:
-- SELECT * FROM profiles WHERE user_type = 'instructor';
-- SELECT * FROM instructors;
-- SELECT * FROM classes;
