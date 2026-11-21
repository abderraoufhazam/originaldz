-- originaldz — storage bucket + seed data
-- Run after supabase/schema.sql.

-- Public bucket for product images.
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

drop policy if exists "products public read" on storage.objects;
create policy "products public read"
on storage.objects for select
using (bucket_id = 'products');

drop policy if exists "products authenticated insert" on storage.objects;
create policy "products authenticated insert"
on storage.objects for insert
with check (bucket_id = 'products');

-- World Express offices — editable seed (complete the list from the admin panel).
-- Run this section once. Re-running it would duplicate rows.
insert into offices (wilaya_code, name_ar, name_fr, address, phone)
select * from (values
  (16, 'الجزائر العاصمة', 'Alger Centre', '64 Rue Larbi Ben M''hidi, Alger Centre', '0663651616'),
  (9,  'البليدة', 'Blida', 'شارع الإخوة زدري، طريق بني تامو', ''),
  (6,  'بجاية', 'Béjaïa', 'Cité Somacob, Béjaïa', '0660639387'),
  (13, 'تلمسان', 'Tlemcen', 'Tlemcen', '0660634909'),
  (19, 'سطيف', 'Sétif', 'حي أولاد براهم، مقابل مسجد 1014 عبيدة ابن الجراح', '0660631783'),
  (3,  'الأغواط', 'Laghouat', 'Cité Mamourah, en face la Maison de la Culture', ''),
  (17, 'الجلفة', 'Djelfa', 'وسط مدينة الجلفة', ''),
  (17, 'الجلفة - عين وسارة', 'Djelfa - Aïn Oussera', 'مقابل بنك السلام، طريق الشلالة', '0661717869'),
  (28, 'المسيلة', 'M''Sila', 'M''Sila', '0660634974'),
  (48, 'غليزان - وادي ارهيو', 'Relizane - Oued Rhiou', 'Rue Khelifa Moussaoui, Oued Rhiou', '0662542589'),
  (42, 'تيبازة - القليعة', 'Tipaza - Koléa', '01 Rue d''Alger, Koléa', ''),
  (2,  'الشلف - بوقادير', 'Chlef - Boukadir', 'بوقادير', ''),
  (45, 'النعامة - عين الصفراء', 'Naâma - Aïn Sefra', 'عين الصفراء', ''),
  (34, 'برج بوعريريج - رأس الوادي', 'Bordj Bou Arréridj - Ras El Oued', 'رأس الوادي', '')
) as v(wilaya_code, name_ar, name_fr, address, phone)
where not exists (
  select 1 from offices o where o.wilaya_code = v.wilaya_code and o.name_fr = v.name_fr
);
