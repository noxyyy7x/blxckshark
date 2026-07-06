-- Run this AFTER creating an "avatars" storage bucket in the Supabase dashboard
-- (Storage → New bucket → name it exactly "avatars" → make it Public)

-- Allow users to upload/update only their own avatar file (named by their user id)
create policy "Users can upload own avatar"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can update own avatar"
  on storage.objects for update
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Anyone can view avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');
