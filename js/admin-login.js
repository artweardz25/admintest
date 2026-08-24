document.addEventListener('DOMContentLoaded',()=>{
 const form=document.getElementById('loginForm'),err=document.getElementById('loginError'),btn=form?.querySelector('button[type="submit"]');
 if(!window.ArtwearSupabase?.ready){err.textContent='Supabase غير configuré.';return;}
 form.onsubmit=async e=>{
   e.preventDefault();
   err.className='error';
   err.textContent='Connexion...';
   if(btn) btn.disabled=true;
   const f=new FormData(form);
   try{
     const email=String(f.get('email')||'').trim();
     const password=String(f.get('password')||'');
     const {data,error}=await window.ArtwearSupabase.client.auth.signInWithPassword({email,password});
     if(error) throw error;

     // Read the user again from Supabase. This avoids relying on a stale user object
     // when the admin role was added/changed in Raw JSON.
     let user=data?.user;
     const current=await window.ArtwearSupabase.client.auth.getUser();
     if(current.error) throw current.error;
     user=current.data?.user || user;
     let admin=window.ArtwearStore.isAdminUser(user);
     if(!admin){
       const refreshed=await window.ArtwearSupabase.client.auth.refreshSession();
       if(refreshed.error) console.warn('Session refresh:',refreshed.error);
       if(refreshed.data?.user) user=refreshed.data.user;
       admin=window.ArtwearStore.isAdminUser(user);
     }
     if(!admin){
       const role=user?.user_metadata?.role || user?.app_metadata?.role || '(non défini)';
       await window.ArtwearSupabase.client.auth.signOut();
       throw new Error(`Ce compte n’est pas autorisé comme administrateur. Rôle actuel : ${role}. Dans Supabase Auth > utilisateur > Raw JSON, user_metadata doit contenir {"role":"admin"}.`);
     }

     // Force a fresh navigation so an older cached admin page cannot keep the user out.
     window.location.replace('./index.html?v=12');
   }catch(ex){
     err.textContent=ex?.message||'Erreur de connexion.';
     if(btn) btn.disabled=false;
   }
 };
});
