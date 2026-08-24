(function(){
 let sb, products=[], delivery={wilayas:[]}, appearance={storeFont:{url:'',fileName:''},storeFontSizes:{small:100,large:100},navPositionX:0,logoLightUrl:'',logoDarkUrl:'',logoUrl:'',heroUrl:'',heroText:{eyebrow:'ANIME · SPORT · GAMING · CULTURE',title:'PORTE CE\nQUE TU\nAIMES',description:'Des designs uniques pour les passionnés d’anime, de sport, de gaming et de culture.'},categories:{},categoryList:[],icons:{dtf:'▣',fabric:'♢',delivery:'▱',support:'◌',cart:'🛒'},topbar:{leftText:'💳 Paiement à la livraison',rightText:'🚚 Livraison dans les 58 wilayas',leftAlign:'left',rightAlign:'right'},integrations:{googleSheetsUrl:'',metaPixelId:''},deliveryTexts:{title:'MODE DE LIVRAISON',homeTitle:'Livraison à domicile',homeText:'Votre adresse complète',officeTitle:'Livraison au bureau',officeText:'Point / bureau de livraison'}};
 const cardFieldMap={
   productCard:'ProductCard',productInfo:'ProductInfo',productServices:'ProductServices',checkoutSteps:'CheckoutSteps',cartReview:'CartReview',cartItem:'CartItem',deliveryInfo:'DeliveryInfo',deliveryMode:'DeliveryMode',payment:'Payment',summary:'Summary'
 };
 const DEFAULT_SIZE_GUIDES=[{id:'tricot-standard',name:'Guide standard',active:true,tricotName:'TRICOT',pantalonName:'PANTALON',tricot:[['S','48 cm','70 cm'],['M','52 cm','72 cm'],['L','56 cm','74 cm'],['XL','60 cm','76 cm']],pantalon:[]}];
 function normalizeSizeGuides(list){ if(!Array.isArray(list)) return DEFAULT_SIZE_GUIDES.map(g=>JSON.parse(JSON.stringify(g))); return list.map((g,i)=>({id:String(g.id||`guide-${Date.now()}-${i}`),name:String(g.name||`Guide ${i+1}`),active:g.active!==false,tricotName:String(g.tricotName||'TRICOT'),pantalonName:String(g.pantalonName||'PANTALON'),tricot:Array.isArray(g.tricot)?g.tricot.map(r=>[String(r?.[0]||''),String(r?.[1]||''),String(r?.[2]||'')]):[],pantalon:Array.isArray(g.pantalon)?g.pantalon.map(r=>[String(r?.[0]||''),String(r?.[1]||''),String(r?.[2]||'')]):[]})); }
 function getSizeGuides(){ appearance.sizeGuides=normalizeSizeGuides(appearance.sizeGuides); return appearance.sizeGuides; }
 function renderProductSizeGuideSelect(current){ const sel=$('productSizeGuideSelect'); if(!sel)return; const guides=getSizeGuides(); sel.innerHTML='<option value="">Aucun guide</option>'+guides.map(g=>`<option value="${esc(g.id)}" ${String(current||'')===g.id?'selected':''}>${esc(g.name)}${g.active?'':' — inactif'}</option>`).join(''); }
 function renderSizeGuidesPanel(){ const wrap=$('sizeGuidesList'); if(!wrap)return; const guides=getSizeGuides(); wrap.innerHTML=guides.map((g,gi)=>{ const rows=(type)=>g[type].map((r,ri)=>`<div class="size-guide-row"><input data-sg="${g.id}" data-type="${type}" data-row="${ri}" data-col="0" value="${esc(r[0])}" placeholder="Taille"><input data-sg="${g.id}" data-type="${type}" data-row="${ri}" data-col="1" value="${esc(r[1])}" placeholder="Largeur / Tour"><input data-sg="${g.id}" data-type="${type}" data-row="${ri}" data-col="2" value="${esc(r[2])}" placeholder="Longueur"><button type="button" class="btn-small danger" data-sg-remove="${g.id}" data-type="${type}" data-row="${ri}">×</button></div>`).join('')||'<div class="category-empty">Aucune ligne.</div>'; return `<div class="size-guide-card panel"><div class="size-guide-head"><input class="size-guide-name" data-sg-name="${g.id}" value="${esc(g.name)}"><label><input type="checkbox" data-sg-active="${g.id}" ${g.active?'checked':''}> GUIDE DES TAILLES actif</label><button type="button" class="btn-small danger" data-sg-delete="${g.id}">Supprimer</button></div><div class="size-guide-columns"><div><input class="size-guide-section-name" data-sg-section-name="${g.id}|tricot" value="${esc(g.tricotName||'TRICOT')}" placeholder="Nom de la section"><div><div class="size-guide-header"><span>Taille</span><span>Largeur / Tour</span><span>Longueur</span><span></span></div>${rows('tricot')}<button type="button" class="btn-small" data-sg-add="${g.id}" data-type="tricot">+ Ajouter une ligne</button></div><div><input class="size-guide-section-name" data-sg-section-name="${g.id}|pantalon" value="${esc(g.pantalonName||'PANTALON')}" placeholder="Nom de la section"><div><div class="size-guide-header"><span>Taille</span><span>Largeur / Tour</span><span>Longueur</span><span></span></div>${rows('pantalon')}<button type="button" class="btn-small" data-sg-add="${g.id}" data-type="pantalon">+ Ajouter une ligne</button></div></div></div>`; }).join(''); document.querySelectorAll('[data-sg-name]').forEach(e=>e.oninput=()=>{const g=getSizeGuides().find(x=>x.id===e.dataset.sgName);if(g)g.name=e.value;}); document.querySelectorAll('[data-sg-section-name]').forEach(e=>e.oninput=()=>{const [id,type]=e.dataset.sgSectionName.split('|');const g=getSizeGuides().find(x=>x.id===id);if(g)g[type+'Name']=e.value;}); document.querySelectorAll('[data-sg-active]').forEach(e=>e.onchange=()=>{const g=getSizeGuides().find(x=>x.id===e.dataset.sgActive);if(g)g.active=e.checked;}); document.querySelectorAll('[data-sg-add]').forEach(e=>e.onclick=()=>{const g=getSizeGuides().find(x=>x.id===e.dataset.sgAdd);if(g){g[e.dataset.type].push(['','','']);renderSizeGuidesPanel();}}); document.querySelectorAll('[data-sg-remove]').forEach(e=>e.onclick=()=>{const g=getSizeGuides().find(x=>x.id===e.dataset.sgRemove);if(g){g[e.dataset.type].splice(Number(e.dataset.row),1);renderSizeGuidesPanel();}}); document.querySelectorAll('[data-sg-delete]').forEach(e=>e.onclick=async()=>{appearance.sizeGuides=getSizeGuides().filter(g=>g.id!==e.dataset.sgDelete);renderSizeGuidesPanel();renderProductSizeGuideSelect();try{await saveAppearance('Guide supprimé.')}catch(err){if($('sizeGuideMsg')){$('sizeGuideMsg').className='error';$('sizeGuideMsg').textContent=err.message;}}}); document.querySelectorAll('#sizeGuidesList input[data-sg]').forEach(e=>e.oninput=()=>{const g=getSizeGuides().find(x=>x.id===e.dataset.sg),r=g?.[e.dataset.type]?.[Number(e.dataset.row)];if(r)r[Number(e.dataset.col)]=e.value;}); }
 async function saveSizeGuides(){ appearance.sizeGuides=getSizeGuides(); await saveAppearance('Guides des tailles enregistrés.'); renderSizeGuidesPanel(); renderProductSizeGuideSelect(); }
 const DEFAULT_PAGES={"about":{"eyebrow":"NOTRE HISTOIRE","title":"À PROPOS D’ARTWEAR DZ","intro":"Une marque pensée pour celles et ceux qui portent leurs passions avec fierté.","storyTitle":"Notre histoire","storyText":"ARTWEAR DZ est une boutique dédiée aux t-shirts qui transforment les passions en style. Nous créons des designs inspirés de l’anime, du sport, du gaming et de la culture, avec une attention particulière portée à la qualité et aux détails.","missionTitle":"Notre mission","missionText":"Proposer des pièces originales, confortables et accessibles, tout en offrant une expérience de commande simple et une livraison dans toute l’Algérie.","values":[{"title":"Créativité","text":"Des designs qui permettent à chacun d’affirmer son univers."},{"title":"Qualité","text":"Des tissus premium et une impression DTF soignée."},{"title":"Passion","text":"Une marque créée par des passionnés, pour des passionnés."}],"ctaText":"DÉCOUVRIR LA BOUTIQUE →","ctaLink":"boutique.html"},"contact":{"eyebrow":"NOUS SOMMES À VOTRE ÉCOUTE","title":"CONTACTEZ-NOUS","intro":"Une question sur un produit, une commande ou la livraison ? Notre équipe est là pour vous répondre.","email":"contact@artwear-dz.com","phone":"+213 XX XX XX XX XX","address":"Algérie","hours":"7j/7 — 09:00 à 21:00","formTitle":"Envoyez-nous un message","formButton":"ENVOYER LE MESSAGE","formNote":"Votre message sera préparé dans votre messagerie afin que nous puissions vous répondre directement.","success":"Merci ! Votre message a été préparé.","facebook":"","instagram":"","tiktok":""},"terms":{"eyebrow":"INFORMATIONS","title":"CONDITIONS GÉNÉRALES","intro":"Retrouvez ici les conditions générales de la boutique.","body":"Écrivez ici les conditions générales de votre boutique.\n\nVous pouvez modifier entièrement ce contenu depuis le Panel Admin.","ctaText":"RETOUR À LA BOUTIQUE →","ctaLink":"boutique.html"},"howToOrder":{"eyebrow":"GUIDE","title":"COMMENT COMMANDER ?","intro":"Découvrez les étapes simples pour passer votre commande.","body":"1. Choisissez votre produit et votre taille.\n2. Ajoutez le produit au panier.\n3. Vérifiez votre commande.\n4. Renseignez vos informations de livraison.\n5. Validez la commande et attendez notre confirmation.","ctaText":"DÉCOUVRIR LA BOUTIQUE →","ctaLink":"boutique.html"}};
 const $=id=>document.getElementById(id);
 let appearanceEditLang=localStorage.getItem('artwear-admin-appearance-lang')==='ar'?'ar':'fr';
 function ensureAppearanceI18n(){
   appearance.i18n=appearance.i18n||{};
   appearance.i18n.fr=appearance.i18n.fr||{};
   appearance.i18n.ar=appearance.i18n.ar||{};
   return appearance.i18n;
 }
 function captureAppearanceLanguage(lang=appearanceEditLang){
   const i18n=ensureAppearanceI18n();
   const features=(appearance.homeFeatures||[]).map((f,i)=>({title:String($('featureTitle'+(i+1))?.value ?? f.title ?? ''),text:String($('featureText'+(i+1))?.value ?? f.text ?? '')}));
   const services=(appearance.productServices||[]).map((f,i)=>({title:String($('productServiceTitle'+(i+1))?.value ?? f.title ?? ''),text:String($('productServiceText'+(i+1))?.value ?? f.text ?? '')}));
   i18n[lang]={
     topbar:{leftText:String($('topbarLeftText')?.value??appearance.topbar?.leftText??''),rightText:String($('topbarRightText')?.value??appearance.topbar?.rightText??''),leftAlign:String($('topbarLeftAlign')?.value??appearance.topbar?.leftAlign??'left'),rightAlign:String($('topbarRightAlign')?.value??appearance.topbar?.rightAlign??'right')},
     heroText:{eyebrow:String($('heroEyebrowText')?.value??appearance.heroText?.eyebrow??''),title:String($('heroTitleText')?.value??appearance.heroText?.title??''),description:String($('heroDescriptionText')?.value??appearance.heroText?.description??'')},
     homeFeatures:features,
     productServices:services,
     deliveryTexts:{title:String($('deliveryTextTitle')?.value??appearance.deliveryTexts?.title??''),homeTitle:String($('deliveryHomeTitle')?.value??appearance.deliveryTexts?.homeTitle??''),homeText:String($('deliveryHomeText')?.value??appearance.deliveryTexts?.homeText??''),officeTitle:String($('deliveryOfficeTitle')?.value??appearance.deliveryTexts?.officeTitle??''),officeText:String($('deliveryOfficeText')?.value??appearance.deliveryTexts?.officeText??'')},
     navPositionX:Math.max(-180,Math.min(180,Number($('navPositionX')?.value??appearance.navPositionX??0)))
   };
   appearance.i18n=i18n;
 }
 function applyAppearanceLanguageToPanel(lang=appearanceEditLang){
   appearanceEditLang=lang==='ar'?'ar':'fr'; localStorage.setItem('artwear-admin-appearance-lang',appearanceEditLang);
   const i18n=ensureAppearanceI18n(); const base=i18n[appearanceEditLang]||{};
   const fallback=i18n.fr||{};
   const tb=base.topbar||fallback.topbar||appearance.topbar||{};
   if($('topbarLeftText'))$('topbarLeftText').value=tb.leftText??''; if($('topbarRightText'))$('topbarRightText').value=tb.rightText??''; if($('topbarLeftAlign'))$('topbarLeftAlign').value=tb.leftAlign||'left'; if($('topbarRightAlign'))$('topbarRightAlign').value=tb.rightAlign||'right';
   const ht=base.heroText||fallback.heroText||appearance.heroText||{}; if($('heroEyebrowText'))$('heroEyebrowText').value=ht.eyebrow??''; if($('heroTitleText'))$('heroTitleText').value=ht.title??''; if($('heroDescriptionText'))$('heroDescriptionText').value=ht.description??'';
   const hf=base.homeFeatures||fallback.homeFeatures||appearance.homeFeatures||[]; hf.forEach((f,i)=>{if($('featureTitle'+(i+1)))$('featureTitle'+(i+1)).value=f.title??'';if($('featureText'+(i+1)))$('featureText'+(i+1)).value=f.text??'';});
   const ps=base.productServices||fallback.productServices||appearance.productServices||[]; ps.forEach((f,i)=>{if($('productServiceTitle'+(i+1)))$('productServiceTitle'+(i+1)).value=f.title??'';if($('productServiceText'+(i+1)))$('productServiceText'+(i+1)).value=f.text??'';});
   const dt=base.deliveryTexts||fallback.deliveryTexts||appearance.deliveryTexts||{}; if($('deliveryTextTitle'))$('deliveryTextTitle').value=dt.title??'';if($('deliveryHomeTitle'))$('deliveryHomeTitle').value=dt.homeTitle??'';if($('deliveryHomeText'))$('deliveryHomeText').value=dt.homeText??'';if($('deliveryOfficeTitle'))$('deliveryOfficeTitle').value=dt.officeTitle??'';if($('deliveryOfficeText'))$('deliveryOfficeText').value=dt.officeText??'';
   const np=base.navPositionX??fallback.navPositionX??appearance.navPositionX??0; appearance.navPositionX=Math.max(-180,Math.min(180,Number(np)||0)); if($('navPositionX'))$('navPositionX').value=appearance.navPositionX; if($('navPositionValue'))$('navPositionValue').textContent=appearance.navPositionX+' px';
   document.querySelectorAll('.appearance-lang-tab').forEach(b=>b.classList.toggle('active',b.dataset.appearanceLang===appearanceEditLang)); const badge=$('appearanceLanguageBadge'); if(badge)badge.textContent=appearanceEditLang==='ar'?'العربية':'FRANÇAIS';
 }
 function esc(v){return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;').replace(/'/g,'&#39;');}
 function getDefaultStoreTexts(){return window.ArtwearStoreTexts?.DEFAULTS||{};}
 function getStoreTextsMeta(){return window.ArtwearStoreTexts?.META||{};}
 function textCategory(k){const m=getStoreTextsMeta()[k]; if(m?.category==='DYNAMIQUE')return 'DYNAMIQUE'; const c=String(m?.category||'').toUpperCase(); if(c.includes('INDEX'))return 'ACCUEIL'; if(c.includes('BOUTIQUE'))return 'BOUTIQUE'; if(c.includes('PRODUIT'))return 'PRODUIT'; if(c.includes('PANIER'))return 'PANIER'; if(c.includes('COMMANDE'))return 'COMMANDE'; if(c.includes('CONTACT'))return 'CONTACT'; if(c.includes('ABOUT'))return 'ABOUT'; if(c.includes('FOOTER'))return 'FOOTER'; return c||'GLOBAL';}
 function renderStoreTextsEditor(){
   const wrap=$('storeTextsEditor'),json=$('storeTextsJson'); if(!wrap)return;
   const defs=getDefaultStoreTexts(), obj={...defs,...(appearance.storeTexts||{})}, arDefs=window.ArtwearStoreTexts?.AR_DEFAULTS||{}, arObj={...arDefs,...(appearance.storeTextsAr||{})};
   const q=String($('storeTextsSearch')?.value||'').toLowerCase().trim(), cat=String($('storeTextsCategory')?.value||'');
   const keys=Object.keys(defs).filter(k=>{const label=String(getStoreTextsMeta()[k]?.label||defs[k]); const c=textCategory(k); return (!q||label.toLowerCase().includes(q)||k.toLowerCase().includes(q))&&(!cat||c===cat||c.includes(cat));});
   wrap.innerHTML=keys.map(k=>{const label=esc(getStoreTextsMeta()[k]?.label||defs[k]);const val=esc(obj[k]??defs[k]);const arVal=esc(arObj[k]??arDefs[k]??'');const c=esc(textCategory(k));const multi=String(obj[k]??defs[k]).includes('\\n')||String(obj[k]??defs[k]).length>110;return `<div class="store-text-row" data-store-text-key="${esc(k)}"><div class="store-text-meta"><span class="store-text-category">${c}</span><small>${label}</small><code>${esc(k)}</code></div><div class="store-text-input"><div><small>🇫🇷 Français</small><textarea data-store-text-value="${esc(k)}" rows="${multi?3:1}">${val}</textarea></div><div dir="rtl"><small>🇩🇿 العربية</small><textarea data-store-text-ar-value="${esc(k)}" rows="${multi?3:1}">${arVal}</textarea></div></div></div>`;}).join('')||'<div class="category-empty">Aucun texte trouvé.</div>';
   document.querySelectorAll('[data-store-text-value]').forEach(el=>el.oninput=()=>{appearance.storeTexts=appearance.storeTexts||{};appearance.storeTexts[el.dataset.storeTextValue]=el.value;});document.querySelectorAll('[data-store-text-ar-value]').forEach(el=>el.oninput=()=>{appearance.storeTextsAr=appearance.storeTextsAr||{};appearance.storeTextsAr[el.dataset.storeTextArValue]=el.value;});
   if($('storeTextsCount'))$('storeTextsCount').textContent=`${keys.length} texte(s) affiché(s) / ${Object.keys(defs).length} au total`;
   if(json)json.value=JSON.stringify(obj,null,2);
 }
 function loadStoreTextsDefaults(){appearance.storeTexts={...getDefaultStoreTexts()};renderStoreTextsEditor();if($('storeTextsMsg')){$('storeTextsMsg').className='success';$('storeTextsMsg').textContent='Tous les textes d’origine ont été restaurés dans le formulaire. Cliquez sur Enregistrer pour appliquer.';}}
 async function saveStoreTexts(){
   const json=$('storeTextsJson');
   try{
     // Read visible fields first, then merge optional advanced JSON.
     const next={...getDefaultStoreTexts(),...(appearance.storeTexts||{})};const nextAr={...(window.ArtwearStoreTexts?.AR_DEFAULTS||{}),...(appearance.storeTextsAr||{})};
     document.querySelectorAll('[data-store-text-value]').forEach(el=>next[el.dataset.storeTextValue]=el.value);document.querySelectorAll('[data-store-text-ar-value]').forEach(el=>nextAr[el.dataset.storeTextArValue]=el.value);
     if(json && json.value.trim()){const advanced=JSON.parse(json.value);if(advanced&&typeof advanced==='object'&&!Array.isArray(advanced))Object.assign(next,advanced);}
     appearance.storeTexts=next;appearance.storeTextsAr=nextAr; await saveAppearance('Tous les textes du magasin ont été enregistrés.'); renderStoreTextsEditor();
   }catch(e){if($('storeTextsMsg')){$('storeTextsMsg').className='error';$('storeTextsMsg').textContent=e.message;}}
 }
 function showTab(id){document.querySelectorAll('.tab').forEach(x=>x.classList.add('hidden'));$(id).classList.remove('hidden');document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x.dataset.tab===id));const active=document.querySelector(`[data-tab="${id}"]`);if(active&&$('pageTitle'))$('pageTitle').textContent=active.textContent.trim();if(id==='products')loadProducts();if(id==='orders')loadOrders();if(id==='delivery')loadDelivery();if(id==='appearance')loadAppearance();if(id==='pages')loadPages();}
 async function requireAdmin(){
   if(!window.ArtwearSupabase?.ready){
     $('authNotice').classList.remove('hidden');
     $('authNotice').textContent='Supabase غير configuré.';
     return false;
   }
   sb=window.ArtwearSupabase;

   // Give Supabase a moment to restore the persisted session after navigation.
   let sessionData=null;
   for(let attempt=0; attempt<3; attempt++){
     const r=await sb.client.auth.getSession();
     sessionData=r.data?.session||null;
     if(sessionData?.user) break;
     await new Promise(resolve=>setTimeout(resolve,350));
   }

   if(!sessionData?.user){
     $('authNotice').classList.remove('hidden');
     $('authNotice').textContent='Session non trouvée. Rechargez la page puis reconnectez-vous.';
     return false;
   }

   // getUser() asks Supabase for the authoritative user, which avoids a stale
   // JWT/user_metadata immediately after an admin role was changed.
   let user=sessionData.user;
   const current=await sb.client.auth.getUser();
   if(current.data?.user) user=current.data.user;

   if(!window.ArtwearStore.isAdminUser(user)){
     const refreshed=await sb.client.auth.refreshSession();
     if(!refreshed.error && refreshed.data?.user) user=refreshed.data.user;
     if(!window.ArtwearStore.isAdminUser(user)){
       const again=await sb.client.auth.getUser();
       if(again.data?.user) user=again.data.user;
     }
   }

   if(!window.ArtwearStore.isAdminUser(user)){
     $('authNotice').classList.remove('hidden');
     $('authNotice').textContent='Compte connecté mais rôle admin introuvable. Vérifiez Supabase Auth → utilisateur → Raw JSON → user_metadata → role = admin.';
     return false;
   }
   return true;
 }
 
 const DEFAULT_CATEGORIES=[
   {id:'anime',name:'Anime',nameFr:'Anime',nameAr:'أنمي',imageUrl:'',active:true,showOnHome:true,order:0},
   {id:'sport',name:'Sport',nameFr:'Sport',nameAr:'رياضة',imageUrl:'',active:true,showOnHome:true,order:1},
   {id:'gaming',name:'Gaming',nameFr:'Gaming',nameAr:'ألعاب',imageUrl:'',active:true,showOnHome:true,order:2},
   {id:'motivation',name:'Motivation',nameFr:'Motivation',nameAr:'تحفيز',imageUrl:'',active:true,showOnHome:true,order:3},
   {id:'culture',name:'Culture',nameFr:'Culture',nameAr:'ثقافة',imageUrl:'',active:true,showOnHome:true,order:4},
   {id:'streetwear',name:'Streetwear',nameFr:'Streetwear',nameAr:'ستريت وير',imageUrl:'',active:true,showOnHome:true,order:5}
 ];
 function normalizeCategories(list, legacy={}){
   if(Array.isArray(list)){
     return list.map((c,i)=>{const fr=String(c.nameFr||c.name||`Catégorie ${i+1}`);return {id:String(c.id||`cat-${Date.now()}-${i}`),name:fr,nameFr:fr,nameAr:String(c.nameAr||''),imageUrl:String(c.imageUrl||legacy[c.name]||''),active:c.active!==false,showOnHome:c.showOnHome===true,order:Number.isFinite(Number(c.order))?Number(c.order):i};});
   }
   const legacyNames=Object.keys(legacy||{});
   const names=legacyNames.length?legacyNames:DEFAULT_CATEGORIES.map(c=>c.name);
   return names.map((name,i)=>({id:String(name).toLowerCase().replace(/[^a-z0-9]+/g,'-')||`cat-${i}`,name,nameFr:name,nameAr:'',imageUrl:String(legacy?.[name]||''),active:true,showOnHome:i<6,order:i}));
 }
 function getCategoryList(){
   appearance.categoryList=normalizeCategories(appearance.categoryList,appearance.categories||{});
   appearance.categories={};
   appearance.categoryList.forEach(c=>{if(c.imageUrl)appearance.categories[c.name]=c.imageUrl;});
   return appearance.categoryList;
 }
 function setCategoryList(list){
   appearance.categoryList=normalizeCategories(list,appearance.categories||{});
   appearance.categories={};
   appearance.categoryList.forEach(c=>{if(c.imageUrl)appearance.categories[c.name]=c.imageUrl;});
 }
 function categoryById(id){return getCategoryList().find(c=>c.id===id);}
 function renderProductCategorySelect(){
   const sel=$('productCategorySelect'); if(!sel)return;
   const cats=getCategoryList().filter(c=>c.active);
   const current=sel.value;
   sel.innerHTML=cats.map(c=>`<option value="${esc(c.name)}">${esc(c.name)}</option>`).join('');
   if(current && cats.some(c=>c.name===current))sel.value=current;
 }
 function renderCategoriesPanel(){
   const cats=getCategoryList().sort((a,b)=>a.order-b.order);
   const home=cats.filter(c=>c.active&&c.showOnHome).sort((a,b)=>a.order-b.order).slice(0,6);
   const count=$('homeCategoryCount'); if(count)count.textContent=`${home.length} / 6`;
   const slots=$('homeCategorySlots');
   if(slots)slots.innerHTML=home.length?home.map((c,i)=>`<div class="home-category-slot"><span class="slot-number">${i+1}</span><span>${esc(c.name)}</span><button class="btn-small" type="button" data-home-remove="${esc(c.id)}">Retirer</button></div>`).join(''):'<div class="category-empty">Aucune catégorie sélectionnée pour l’accueil.</div>';
   const list=$('categoriesList');
   if(list)list.innerHTML=cats.map(c=>`<div class="category-admin-card"><div class="category-admin-main"><div class="category-admin-thumb">${c.imageUrl?`<img src="${esc(c.imageUrl)}" alt="">`:'<span>IMG</span>'}</div><div><b>${esc(c.name)}</b><small>Ordre ${c.order} · ${c.active?'Active':'Désactivée'} · ${c.showOnHome?'Accueil':'Pas sur accueil'}</small></div></div><div class="category-admin-actions"><button class="btn-small" type="button" data-category-edit="${esc(c.id)}">Modifier</button><button class="btn-small" type="button" data-category-home="${esc(c.id)}">${c.showOnHome?'Retirer de l’accueil':'Ajouter à l’accueil'}</button><button class="btn-small danger" type="button" data-category-delete="${esc(c.id)}">Supprimer</button></div></div>`).join('')||'<div class="category-empty">Aucune catégorie.</div>';
   document.querySelectorAll('[data-category-edit]').forEach(b=>b.onclick=()=>openCategoryForm(b.dataset.categoryEdit));
   document.querySelectorAll('[data-category-delete]').forEach(b=>b.onclick=()=>deleteCategory(b.dataset.categoryDelete));
   document.querySelectorAll('[data-category-home]').forEach(b=>b.onclick=()=>toggleHomeCategory(b.dataset.categoryHome));
   document.querySelectorAll('[data-home-remove]').forEach(b=>b.onclick=()=>toggleHomeCategory(b.dataset.homeRemove));
   renderProductCategorySelect();
 }
 async function saveCategorySettings(message='Catégories enregistrées.'){
   setCategoryList(getCategoryList());
   const {error}=await sb.client.from('store_settings').upsert({id:1,appearance});
   if(error)throw error;
   renderCategoriesPanel();
   if($('categoryMsg')){$('categoryMsg').className='success';$('categoryMsg').textContent=message;}
 }
 async function loadCategories(){
   try{
     const settings=await window.ArtwearStore.getStoreSettings();
     appearance=settings.appearance||appearance;
     setCategoryList(normalizeCategories(appearance.categoryList,appearance.categories||{}));
     renderCategoriesPanel();
     if($('categoryFormPanel'))$('categoryFormPanel').classList.add('hidden');
   }catch(e){if($('categoryMsg')){$('categoryMsg').className='error';$('categoryMsg').textContent=e.message;}}
 }
 function openCategoryForm(id){
   const c=id?categoryById(id):{id:'',name:'',nameFr:'',nameAr:'',order:getCategoryList().length,active:true,showOnHome:false};
   const f=$('categoryForm'); if(!f)return;
   f.elements.id.value=c.id||'';f.elements.nameFr.value=c.nameFr||c.name||'';f.elements.nameAr.value=c.nameAr||'';f.elements.order.value=Number(c.order||0);f.elements.active.checked=c.active!==false;f.elements.showOnHome.checked=!!c.showOnHome;
   $('categoryFormTitle').textContent=id?'Modifier une catégorie':'Ajouter une catégorie';$('categoryFormPanel').classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'});
 }
 async function toggleHomeCategory(id){
   const list=getCategoryList(), c=list.find(x=>x.id===id); if(!c)return;
   if(!c.showOnHome){const count=list.filter(x=>x.active&&x.showOnHome).length;if(count>=6){$('categoryMsg').className='error';$('categoryMsg').textContent='Vous pouvez afficher seulement 6 catégories sur l’accueil.';return;}}
   c.showOnHome=!c.showOnHome;
   if(c.showOnHome){const max=Math.max(-1,...list.map(x=>Number(x.order)||0));c.order=max+1;}
   try{await saveCategorySettings('Sélection de l’accueil enregistrée.');}catch(e){$('categoryMsg').className='error';$('categoryMsg').textContent=e.message;}
 }
 async function deleteCategory(id){
   const c=categoryById(id);if(!c)return;if(!confirm(`Supprimer la catégorie « ${c.name} » ?`))return;
   try{
     const {error}=await sb.client.from('products').update({category:null}).eq('category',c.name); if(error) console.warn('Products category cleanup:',error.message);
     setCategoryList(getCategoryList().filter(x=>x.id!==id));
     await saveCategorySettings('Catégorie supprimée.');
   }catch(e){$('categoryMsg').className='error';$('categoryMsg').textContent=e.message;}
 }
 $('addCategory')?.addEventListener('click',()=>openCategoryForm());
 $('cancelCategory')?.addEventListener('click',()=>{$('categoryFormPanel').classList.add('hidden');});
 $('categoryForm')?.addEventListener('submit',async e=>{
   e.preventDefault();const f=new FormData(e.target),id=String(f.get('id')||''),nameFr=String(f.get('nameFr')||'').trim(),nameAr=String(f.get('nameAr')||'').trim();if(!nameFr)return;const name=nameFr;
   const list=getCategoryList();const duplicate=list.find(c=>c.nameFr.toLowerCase()===nameFr.toLowerCase()&&c.id!==id);if(duplicate){$('categoryMsg').className='error';$('categoryMsg').textContent='Ce nom de catégorie existe déjà.';return;}
   const show=f.get('showOnHome')==='on';if(show && list.filter(c=>c.active&&c.showOnHome&&c.id!==id).length>=6){$('categoryMsg').className='error';$('categoryMsg').textContent='Maximum 6 catégories sur l’accueil.';return;}
   if(id){const c=list.find(x=>x.id===id);const oldName=c?.name;if(c){Object.assign(c,{name:nameFr,nameFr,nameAr,order:Number(f.get('order')||0),active:f.get('active')==='on',showOnHome:show});if(oldName&&oldName!==name){const {error}=await sb.client.from('products').update({category:name}).eq('category',oldName);if(error)console.warn('Products category rename:',error.message);}}}
   else {list.push({id:`cat-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,name:nameFr,nameFr,nameAr,imageUrl:'',order:Number(f.get('order')||list.length),active:f.get('active')==='on',showOnHome:show});}
   try{setCategoryList(list);await saveCategorySettings(id?'Catégorie modifiée.':'Catégorie ajoutée.');$('categoryFormPanel').classList.add('hidden');}catch(err){$('categoryMsg').className='error';$('categoryMsg').textContent=err.message;}
 });
 function normalizeProductSizeGuideType(value){
   const v=String(value||'tricot').trim().toLowerCase();
   return v==='pantalon'?'pantalon':(v==='les_deux'||v==='les-deux'||v==='both'?'les_deux':'tricot');
 }
 async function loadProducts(){
   try{const settings=await window.ArtwearStore.getStoreSettings();appearance=settings.appearance||appearance;appearance.sizeGuides=normalizeSizeGuides(appearance.sizeGuides);renderProductSizeGuideSelect($('productForm')?.elements?.size_guide_id?.value||''); if($('productSizeGuideType')) $('productSizeGuideType').value=normalizeProductSizeGuideType($('productForm')?.elements?.size_guide_type?.value||'tricot');}catch(e){}
   const {data,error}=await sb.client.from('products').select('*').order('created_at',{ascending:false});
   if(error){$('productsBody').innerHTML='<tr><td colspan="6">Erreur: '+error.message+'</td></tr>';return;}
   products=data||[];$('statProducts').textContent=products.length;
   $('productsBody').innerHTML=products.map(p=>`<tr><td><img class="thumb" src="${(p.images&&p.images[0])||''}" alt=""></td><td><b>${p.name}</b></td><td>${p.category||''}</td><td>${Number(p.price||0).toLocaleString('fr-FR')} DA</td><td>${p.stock??0}</td><td><div class="actions"><button class="btn-small" data-edit="${p.id}">Modifier</button><button class="btn-small danger" data-delete="${p.id}">Supprimer</button></div></td></tr>`).join('')||'<tr><td colspan="6">Aucun produit.</td></tr>';
   document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>editProduct(b.dataset.edit)); document.querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>deleteProduct(b.dataset.delete));
 }
 function resetForm(){ $('productForm').reset();$('productForm').elements.id.value='';$('currentImages').innerHTML='';$('productFormTitle').textContent='Ajouter un produit';$('productMsg').textContent='';$('productFormPanel').classList.add('hidden'); }
 async function editProduct(id){const p=products.find(x=>x.id===id);if(!p)return;const f=$('productForm');f.elements.id.value=p.id;f.elements.name.value=p.name||'';f.elements.price.value=p.price||0;f.elements.category.value=p.category||'Anime';f.elements.stock.value=p.stock??0;f.elements.description.value=p.description||'';f.elements.bio.value=p.bio||'100% coton premium\nImpression DTF haute qualité\nCoupe confortable\nDisponible en '+((p.sizes||['S','M','L','XL']).join(', '));f.elements.sizes.value=(p.sizes||['S','M','L','XL']).join(',');renderProductSizeGuideSelect(p.size_guide_id||''); if(f.elements.size_guide_type) f.elements.size_guide_type.value=normalizeProductSizeGuideType(p.size_guide_type||'tricot');f.elements.new.checked=!!p.new;f.elements.popular.checked=!!p.popular;$('currentImages').innerHTML=(p.images||[]).map((x,i)=>`<img class="thumb" src="${x}" alt="image ${i+1}">`).join('');$('productFormTitle').textContent='Modifier le produit';$('productFormPanel').classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'});}
 async function uploadImages(files,id){
  if(!sb.ready) throw new Error('Supabase Storage غير configuré.');
  const urls=[];
  for(const file of files){
    if(!/^image\/(jpeg|png|webp)$/.test(file.type)) throw new Error('Format image non autorisé. Utilisez JPG, PNG ou WebP.');
    if(file.size>(options.maxSize||5*1024*1024)) throw new Error(options.maxSizeMessage||'Fichier trop volumineux.');
    const originalName=String(file.name||'image'); const safe=originalName.replace(/[^a-z0-9._-]/gi,'_');
    const path=`products/${id}/${Date.now()}_${Math.random().toString(36).slice(2,8)}_${safe}`;
    const mime=String(file.type||'').toLowerCase();
    if(!mime) throw new Error('Type MIME de l’image introuvable.');
    const {error}=await sb.client.storage.from(sb.bucket).upload(path,file,{contentType:mime,upsert:false,cacheControl:'31536000'});
    if(error) throw error;
    const {data}=sb.client.storage.from(sb.bucket).getPublicUrl(path);
    urls.push(data.publicUrl);
  }
  return urls;
 }
 $('newProduct').onclick=()=>{$('productForm').reset();$('productForm').elements.id.value='';$('productForm').elements.bio.value='100% coton premium\nImpression DTF haute qualité\nCoupe confortable\nDisponible en S, M, L, XL';renderProductSizeGuideSelect('');if($('productSizeGuideType')) $('productSizeGuideType').value='tricot';$('currentImages').innerHTML='';$('productFormTitle').textContent='Ajouter un produit';$('productFormPanel').classList.remove('hidden');};
 $('cancelProduct').onclick=resetForm;
 $('productForm').onsubmit=async e=>{
   e.preventDefault();const f=new FormData(e.target),id=f.get('id');
   const data={name:f.get('name').trim(),price:Number(f.get('price')||0),category:f.get('category'),stock:Number(f.get('stock')||0),description:f.get('description')||'',bio:f.get('bio')||'',sizes:(f.get('sizes')||'S,M,L,XL').split(',').map(x=>x.trim()).filter(Boolean),is_new:f.get('new')==='on',popular:f.get('popular')==='on',active:true,size_guide_id:f.get('size_guide_id')||null,size_guide_type:normalizeProductSizeGuideType(f.get('size_guide_type')||'tricot')};
   const files=e.target.elements.images.files;
   try{
     $('productMsg').className='';$('productMsg').textContent='Enregistrement...';
     let productId=id, images=[];
     if(id){
       const old=products.find(x=>x.id===id)||{}; images=old.images||[];
       if(files.length) images=images.concat(await uploadImages([...files],id));
       const {error}=await sb.client.from('products').update({...data,images}).eq('id',id); if(error) throw error;
     }else{
       const {data:created,error}=await sb.client.from('products').insert({...data,images:[]}).select('id').single(); if(error) throw error;
       productId=created.id; if(files.length) images=await uploadImages([...files],productId);
       const {error:updateError}=await sb.client.from('products').update({images}).eq('id',productId); if(updateError) throw updateError;
     }
     $('productMsg').className='success';$('productMsg').textContent='Produit enregistré.';await loadProducts();setTimeout(resetForm,500);
   }catch(err){$('productMsg').className='error';$('productMsg').textContent=err.message;}
 };
 async function deleteProduct(id){
   if(!confirm('Supprimer ce produit ?'))return;
   const p=products.find(x=>x.id===id);
   const {error}=await sb.client.from('products').delete().eq('id',id); if(error){alert(error.message);return;}
   if(p?.images?.length){for(const url of p.images){const marker='/product-images/';const idx=url.indexOf(marker);if(idx>=0){const path=decodeURIComponent(url.slice(idx+marker.length));await sb.client.storage.from(sb.bucket).remove([path]).catch(()=>{});}}}
   await loadProducts();
 }
 let allOrders=[];
 function localDateKey(value){const d=new Date(value);if(Number.isNaN(d.getTime()))return '';return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
 function todayKey(){return localDateKey(new Date());}
 function statusClass(status){return ({'Nouveau':'status-new','Confirmée':'status-confirmed','Expédiée':'status-shipped','Livrée':'status-delivered','Annulée':'status-cancelled'})[status]||'status-other';}
 function selectedOrders(){
   const key=$('ordersDate')?.value||todayKey();
   const status=$('ordersStatusFilter')?.value||'all';
   return allOrders.filter(o=>{
     const sameDay=localDateKey(o.created_at)===key;
     const sameStatus=status==='all'||(o.status||'Nouveau')===status;
     return sameDay&&sameStatus;
   });
 }
 function renderOrders(){
   const key=$('ordersDate')?.value||todayKey(),orders=selectedOrders();
   $('ordersDayCount').textContent=orders.length;
   $('ordersDayLabel').textContent=key?new Date(`${key}T12:00:00`).toLocaleDateString('fr-FR',{weekday:'long',day:'2-digit',month:'long',year:'numeric'}):'—';
   $('ordersBody').innerHTML=orders.map(o=>{const c=o.customer||{},d=o.delivery||{},st=o.status||'Nouveau';return `<tr><td><b>${esc(o.order_id||o.id)}</b><br><small>${o.created_at?new Date(o.created_at).toLocaleString('fr-FR'):''}</small></td><td>${esc(c.name||'')}<br>${esc(c.phone||'')}</td><td>${esc(d.label||'')}<br>${esc(c.wilaya||'')}<br>${esc(c.officeName||'')}</td><td>${Number(o.total||0).toLocaleString('fr-FR')} DA</td><td><select class="order-status ${statusClass(st)}" data-status="${esc(o.id)}"><option ${st==='Nouveau'?'selected':''}>Nouveau</option><option ${st==='Confirmée'?'selected':''}>Confirmée</option><option ${st==='Expédiée'?'selected':''}>Expédiée</option><option ${st==='Livrée'?'selected':''}>Livrée</option><option ${st==='Annulée'?'selected':''}>Annulée</option></select></td></tr>`}).join('')||'<tr><td class="orders-empty" colspan="5">Aucune commande pour cette journée.</td></tr>';
   document.querySelectorAll('[data-status]').forEach(sel=>sel.onchange=async()=>{const old=sel.value;sel.className=`order-status ${statusClass(old)}`;const {error}=await sb.client.from('orders').update({status:old}).eq('id',sel.dataset.status);if(error){alert(error.message);await loadOrders();return;}const found=allOrders.find(o=>String(o.id)===String(sel.dataset.status));if(found)found.status=old;updateOrderStats();loadDashboardStats();});
 }
 function localDayRange(){
   const now=new Date();
   const start=new Date(now.getFullYear(),now.getMonth(),now.getDate());
   const end=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1);
   return {start:start.toISOString(),end:end.toISOString()};
 }
 function updateOrderStats(){ renderOrders(); }
 async function loadDashboardStats(){
   try{
     const {start,end}=localDayRange();
     const [ordersTotal,ordersToday,visitorsTotal,visitorsToday]=await Promise.all([
       sb.client.from('orders').select('id',{count:'exact',head:true}),
       sb.client.from('orders').select('id',{count:'exact',head:true}).gte('created_at',start).lt('created_at',end),
       sb.client.from('site_visitors').select('id',{count:'exact',head:true}),
       sb.client.from('site_visitors').select('id',{count:'exact',head:true}).eq('visit_date',todayKey())
     ]);
     if(ordersTotal.error) throw ordersTotal.error;
     if(ordersToday.error) throw ordersToday.error;
     if(visitorsTotal.error) throw visitorsTotal.error;
     if(visitorsToday.error) throw visitorsToday.error;
     $('statOrders').textContent=ordersTotal.count||0;
     $('statNew').textContent=ordersToday.count||0;
     $('statNewDate').textContent='Aujourd’hui · '+new Date().toLocaleDateString('fr-FR');
     $('statVisitors').textContent=visitorsTotal.count||0;
     $('statVisitorsToday').textContent='Aujourd’hui : '+(visitorsToday.count||0);
   }catch(err){
     console.warn('Dashboard stats unavailable:',err.message);
     // Keep the dashboard usable even if the visitor migration has not been run yet.
     $('statOrders').textContent=allOrders.length;
     $('statNew').textContent=allOrders.filter(o=>localDateKey(o.created_at)===todayKey()).length;
     if($('statVisitors'))$('statVisitors').textContent='—';
     if($('statVisitorsToday'))$('statVisitorsToday').textContent='Migration requise';
   }
 }
 async function loadOrders(){
   const {data,error}=await sb.client.from('orders').select('*').order('created_at',{ascending:false}).limit(1000);
   if(error){$('ordersBody').innerHTML='<tr><td colspan="5">Erreur: '+esc(error.message)+'</td></tr>';return;}
   allOrders=data||[];
   if(!$('ordersDate').value)$('ordersDate').value=todayKey();
   updateOrderStats();
   await loadDashboardStats();
 }
 function shiftOrdersDay(delta){const input=$('ordersDate');const d=new Date(`${input.value||todayKey()}T12:00:00`);d.setDate(d.getDate()+delta);input.value=localDateKey(d);renderOrders();}
 function exportOrdersExcel(){
   const key=$('ordersDate')?.value||todayKey(),orders=selectedOrders();
   const escHtml=v=>String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
   const rows=orders.map(o=>{const c=o.customer||{},d=o.delivery||{},st=o.status||'Nouveau';return `<tr><td>${escHtml(o.order_id||o.id)}</td><td>${escHtml(o.created_at?new Date(o.created_at).toLocaleString('fr-FR'):'')}</td><td>${escHtml(c.name||'')}</td><td>${escHtml(c.phone||'')}</td><td>${escHtml(c.wilaya||'')}</td><td>${escHtml(d.label||'')}</td><td>${escHtml(d.officeName||'')}</td><td>${escHtml(Number(o.total||0).toLocaleString('fr-FR'))} DA</td><td>${escHtml(st)}</td></tr>`}).join('');
   const html=`<!doctype html><html><head><meta charset="utf-8"><style>table{border-collapse:collapse;font-family:Arial}th,td{border:1px solid #999;padding:7px}th{background:#222;color:#fff}</style></head><body><h2>ARTWEAR DZ - Commandes du ${escHtml(key)}</h2><table><thead><tr><th>Commande</th><th>Date</th><th>Client</th><th>Téléphone</th><th>Wilaya</th><th>Livraison</th><th>Bureau</th><th>Total</th><th>Statut</th></tr></thead><tbody>${rows||'<tr><td colspan="9">Aucune commande</td></tr>'}</tbody></table></body></html>`;
   const blob=new Blob([html],{type:'application/vnd.ms-excel;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`ARTWEAR_DZ_commandes_${key}.xls`;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
 }

 async function loadDelivery(){
   delivery=await window.ArtwearStore.getDeliverySettings();
   $('defaultHome').value=delivery.homePrice||800;
   $('defaultOffice').value=delivery.officePrice||600;
   const rows=delivery.wilayas||[];
   $('deliveryBody').innerHTML=rows.map((w,i)=>{
     let offices=Array.isArray(w.offices)?w.offices.filter(Boolean):[];
     if(!offices.length && w.officeName){
       offices=[{id:`${w.id||i+1}-1`,name:w.officeName,address:'',phone:'',price:w.officePrice??delivery.officePrice??600,active:true}];
     }
     return `<div class="wilaya-delivery-card" data-wilaya-index="${i}">
       <div class="wilaya-delivery-head">
         <div class="wilaya-title-fields">
           <label>Nom de la wilaya<input data-wilaya-field="name" value="${esc(String(w.name||''))}" placeholder="Ex: Alger Centre / Nouvelle wilaya"></label>
           <label class="wilaya-active"><input type="checkbox" data-wilaya-field="active" ${w.active!==false?'checked':''}> Wilaya active dans la boutique</label>
           <small>Prix domicile: ${Number(w.homePrice??delivery.homePrice??800).toLocaleString('fr-FR')} DA</small>
         </div>
         <div class="wilaya-actions"><button type="button" class="btn-small add-office" data-wilaya="${i}">+ AJOUTER UN BUREAU</button><button type="button" class="btn-small danger remove-wilaya" data-wilaya="${i}">✕ SUPPRIMER</button></div>
       </div>
       <div class="wilaya-delivery-fields"><label>Prix domicile<input type="number" min="0" data-home="${i}" value="${w.homePrice??delivery.homePrice??800}"></label></div>
       <div class="offices-list" data-offices="${i}">${offices.map((o,j)=>officeEditorHTML(i,j,o)).join('')}</div>
       <div class="office-empty" data-office-empty="${i}" ${offices.length?'hidden':''}>Aucun bureau ajouté pour cette wilaya. Cliquez sur « + AJOUTER UN BUREAU ».</div>
       <div class="municipalities-section">
         <div class="section-mini-head"><strong>Communes / Municipalités</strong><button type="button" class="btn-small add-municipality" data-wilaya="${i}">+ AJOUTER UNE COMMUNE</button></div>
         <div class="municipalities-list" data-municipalities="${i}">${(Array.isArray(w.municipalities)?w.municipalities:[]).map((m,j)=>municipalityEditorHTML(i,j,m)).join('')}</div>
         <div class="municipality-empty" data-municipality-empty="${i}" ${(w.municipalities||[]).length?'hidden':''}>Aucune commune ajoutée.</div>
       </div>
     </div>`;
   }).join('');
   bindOfficeControls();
   bindMunicipalityControls();
   bindWilayaControls();
 }
 function bindWilayaControls(){
   document.querySelectorAll('.remove-wilaya').forEach(btn=>{
     if(btn.dataset.bound)return;
     btn.dataset.bound='1';
     btn.onclick=()=>{
       const i=Number(btn.dataset.wilaya);
       if(!confirm('Supprimer cette wilaya et tous ses bureaux/communes ?'))return;
       delivery.wilayas.splice(i,1);
       loadDelivery();
     };
   });
 }
 function addWilaya(){
   if(!Array.isArray(delivery.wilayas))delivery.wilayas=[];
   const nextId=String(Math.max(0,...delivery.wilayas.map(w=>Number(w.id)||0))+1);
   delivery.wilayas.push({id:nextId,name:'',homePrice:Number($('defaultHome')?.value||delivery.homePrice||800),officePrice:Number($('defaultOffice')?.value||delivery.officePrice||600),officeName:'',offices:[],municipalities:[],active:true});
   loadDelivery();
   const cards=document.querySelectorAll('.wilaya-delivery-card');
   cards[cards.length-1]?.scrollIntoView({behavior:'smooth',block:'center'});
   cards[cards.length-1]?.querySelector('[data-wilaya-field="name"]')?.focus();
 }
 $('addWilaya').onclick=addWilaya;
 function officeEditorHTML(wilayaIndex,index,o={}){
   const id=o.id||`${wilayaIndex+1}-${index+1}`;
   const name=String(o.name||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
   const address=String(o.address||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
   const phone=String(o.phone||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
   const price=o.price??delivery.officePrice??600;
   const active=o.active!==false;
   return `<div class="office-card" data-office-index="${index}" data-office-id="${id}">
     <div class="office-card-head"><strong>Bureau <span class="office-number">${index+1}</span></strong><button type="button" class="btn-small danger remove-office">✕ Supprimer</button></div>
     <div class="office-grid">
       <label>Nom du bureau<input data-office-field="name" value="${name}" placeholder="Ex: Yalidine Alger Centre"></label>
       <label>Prix (DA)<input type="number" min="0" data-office-field="price" value="${price}"></label>
       <label>Adresse<input data-office-field="address" value="${address}" placeholder="Adresse du bureau"></label>
       <label>Téléphone<input data-office-field="phone" value="${phone}" placeholder="05 / 06 / 07 ..."></label>
       <label class="office-active"><input type="checkbox" data-office-field="active" ${active?'checked':''}> Bureau actif</label>
     </div>
   </div>`;
 }
 function municipalityEditorHTML(wilayaIndex,index,name=''){
   const safe=String(name||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
   return `<div class="municipality-card"><input data-municipality-field value="${safe}" placeholder="Nom de la commune"><button type="button" class="btn-small danger remove-municipality">✕</button></div>`;
 }
 function bindMunicipalityControls(){
   document.querySelectorAll('.add-municipality').forEach(btn=>btn.onclick=()=>{
     const i=Number(btn.dataset.wilaya), list=document.querySelector(`[data-municipalities="${i}"]`);
     if(!list)return; list.insertAdjacentHTML('beforeend',municipalityEditorHTML(i,list.querySelectorAll('.municipality-card').length,'')); updateMunicipalityEmpty(i);
     const input=list.lastElementChild?.querySelector('input'); input?.focus(); bindMunicipalityRemove();
   });
   bindMunicipalityRemove();
 }
 function bindMunicipalityRemove(){
   document.querySelectorAll('.remove-municipality').forEach(btn=>{if(btn.dataset.bound)return;btn.dataset.bound='1';btn.onclick=()=>{const list=btn.closest('.municipalities-list');const i=Number(list.dataset.municipalities);btn.closest('.municipality-card')?.remove();updateMunicipalityEmpty(i);};});
 }
 function updateMunicipalityEmpty(i){const list=document.querySelector(`[data-municipalities="${i}"]`),empty=document.querySelector(`[data-municipality-empty="${i}"]`);if(list&&empty)empty.hidden=list.querySelectorAll('.municipality-card').length>0;}
 function bindOfficeControls(){
   document.querySelectorAll('.add-office').forEach(btn=>btn.onclick=()=>{
     const i=Number(btn.dataset.wilaya), list=document.querySelector(`[data-offices="${i}"]`);
     if(!list)return;
     const index=list.querySelectorAll('.office-card').length;
     list.insertAdjacentHTML('beforeend',officeEditorHTML(i,index,{id:`${delivery.wilayas[i].id||i+1}-${Date.now()}-${index+1}`,name:'',address:'',phone:'',price:delivery.wilayas[i].officePrice??delivery.officePrice??600,active:true}));
     renumberOffices(i); updateOfficeEmpty(i);
     list.lastElementChild?.scrollIntoView({behavior:'smooth',block:'nearest'});
   });
   document.querySelectorAll('.remove-office').forEach(btn=>btn.onclick=()=>{
     const card=btn.closest('.office-card'), parent=card?.closest('.offices-list');
     if(!card||!parent)return;
     const i=Number(parent.dataset.offices); card.remove(); renumberOffices(i); updateOfficeEmpty(i);
   });
 }
 function renumberOffices(i){
   document.querySelectorAll(`[data-offices="${i}"] .office-card`).forEach((card,j)=>card.querySelector('.office-number').textContent=j+1);
 }
 function updateOfficeEmpty(i){
   const list=document.querySelector(`[data-offices="${i}"]`), empty=document.querySelector(`[data-office-empty="${i}"]`);
   if(list&&empty)empty.hidden=list.querySelectorAll('.office-card').length>0;
 }
 async function saveDeliverySettings(){
   const rows=delivery.wilayas||[];
   rows.forEach((w,i)=>{
     w.name=(document.querySelector(`[data-wilaya-index="${i}"] [data-wilaya-field="name"]`)?.value||w.name||'').trim();
     w.active=!!document.querySelector(`[data-wilaya-index="${i}"] [data-wilaya-field="active"]`)?.checked;
     w.homePrice=Number(document.querySelector(`[data-home="${i}"]`)?.value||0);
     w.officePrice=Number($('defaultOffice').value||0);
     const list=document.querySelector(`[data-offices="${i}"]`);
     const municipalitiesList=document.querySelector(`[data-municipalities="${i}"]`);
     w.municipalities=[...municipalitiesList.querySelectorAll('[data-municipality-field]')].map(x=>x.value.trim()).filter(Boolean);
     w.offices=[...list.querySelectorAll('.office-card')].map((card,j)=>({
       id:card.dataset.officeId||`${w.id||i+1}-${j+1}`,
       name:card.querySelector('[data-office-field="name"]')?.value.trim()||`Bureau ${j+1} ${w.name}`,
       address:card.querySelector('[data-office-field="address"]')?.value.trim()||'',
       phone:card.querySelector('[data-office-field="phone"]')?.value.trim()||'',
       price:Number(card.querySelector('[data-office-field="price"]')?.value||w.officePrice||600),
       active:!!card.querySelector('[data-office-field="active"]')?.checked
     }));
     const first=w.offices.find(o=>o.active); w.officeName=first?.name||'';
   });
   delivery.homePrice=Number($('defaultHome').value||0);
   delivery.officePrice=Number($('defaultOffice').value||600);
   const {error}=await sb.client.from('store_settings').upsert({id:1,delivery});
   $('deliveryMsg').className=error?'error':'success';
   $('deliveryMsg').textContent=error?error.message:'Livraison enregistrée.';
 }
 $('saveDelivery').onclick=saveDeliverySettings;

 async function uploadAppearanceFile(file,folder,options={}){
   if(!file) return '';
   const allowed=options.allowed||['image/png','image/jpeg','image/webp'];
   const mime=String(file.type||'').toLowerCase();
   if(!allowed.includes(mime)) throw new Error('Format non autorisé. Utilisez PNG, JPG ou WEBP.');
   if(file.size>5*1024*1024) throw new Error('Image trop volumineuse. Maximum 5 MB.');
   const originalName=String(file.name||'image'); const safe=originalName.replace(/[^a-z0-9._-]/gi,'_');
   const path=`appearance/${folder}_${Date.now()}_${Math.random().toString(36).slice(2,8)}_${safe}`;
   const {error}=await sb.client.storage.from(sb.bucket).upload(path,file,{contentType:mime,upsert:false,cacheControl:'31536000'});
   if(error) throw error;
   return sb.client.storage.from(sb.bucket).getPublicUrl(path).data.publicUrl;
 }
 function setPreview(id,url,cls,alt){
   const el=$(id); if(!el)return;
   const previewUrl=String(url||'').startsWith('assets/')?`../${url}`:url;
   el.innerHTML=previewUrl?`<img src="${previewUrl}" class="${cls}" alt="${alt}">`:`<span>Aucune image.</span>`;
 }
 const DEFAULT_LOGO_SLOTS={
   mainLight:{x:0,y:0,scale:1},mainDark:{x:0,y:0,scale:1}
 };
 function normalizeLogoSlots(raw){
   const src=raw||{}; const out={};
   Object.keys(DEFAULT_LOGO_SLOTS).forEach(k=>{
     const d=DEFAULT_LOGO_SLOTS[k], v=src[k]||{};
     out[k]={x:Number.isFinite(Number(v.x))?Number(v.x):d.x,y:Number.isFinite(Number(v.y))?Number(v.y):d.y,scale:Number.isFinite(Number(v.scale))?Number(v.scale):d.scale};
   });
   return out;
 }
 function logoSlotStyle(slot){
   const s=normalizeLogoSlots(appearance.logoSlots)[slot]||DEFAULT_LOGO_SLOTS[slot];
   return `--slot-x:${s.x}px;--slot-y:${s.y}px;--slot-scale:${s.scale};`;
 }
 function setupLogoSlot(id,url,slot){
   const el=$(id); if(!el)return;
   const s=normalizeLogoSlots(appearance.logoSlots)[slot]||DEFAULT_LOGO_SLOTS[slot];
   el.style.setProperty('--slot-x',`${s.x}px`);el.style.setProperty('--slot-y',`${s.y}px`);el.style.setProperty('--slot-scale',s.scale);
   el.innerHTML=url?`<img src="${url}" class="slot-image" alt="Logo" draggable="false">`:`<span>Aucune image.</span>`;
   const x=$(slot==='mainLight'?'logoMainLightX':'logoMainDarkX');
   const y=$(slot==='mainLight'?'logoMainLightY':'logoMainDarkY');
   const z=$(slot==='mainLight'?'logoMainLightScale':'logoMainDarkScale');
   if(x)x.value=s.x;if(y)y.value=s.y;if(z)z.value=Math.round(s.scale*100);
 }
 function bindLogoSlotControls(){
   const map={mainLight:'logoLightPreview',mainDark:'logoDarkPreview'};
   Object.entries(map).forEach(([slot,id])=>{
     const el=$(id);if(!el||el.dataset.bound)return;el.dataset.bound='1';
     const ids={mainLight:['logoMainLightX','logoMainLightY','logoMainLightScale'],mainDark:['logoMainDarkX','logoMainDarkY','logoMainDarkScale']}[slot];
     const sync=()=>{
       appearance.logoSlots=normalizeLogoSlots(appearance.logoSlots);
       appearance.logoSlots[slot].x=Number($(ids[0])?.value||0);appearance.logoSlots[slot].y=Number($(ids[1])?.value||0);appearance.logoSlots[slot].scale=Number($(ids[2])?.value||100)/100;
       el.style.setProperty('--slot-x',`${appearance.logoSlots[slot].x}px`);el.style.setProperty('--slot-y',`${appearance.logoSlots[slot].y}px`);el.style.setProperty('--slot-scale',appearance.logoSlots[slot].scale);
     };
     ids.forEach(i=>$(i)?.addEventListener('input',sync));
     let drag=null;
     el.addEventListener('pointerdown',e=>{if(!el.querySelector('.slot-image'))return;drag={x:e.clientX,y:e.clientY,sx:Number($(ids[0])?.value||0),sy:Number($(ids[1])?.value||0)};el.classList.add('dragging');el.setPointerCapture?.(e.pointerId);e.preventDefault();});
     el.addEventListener('pointermove',e=>{if(!drag)return;const nx=Math.max(-180,Math.min(180,drag.sx+e.clientX-drag.x));const ny=Math.max(-50,Math.min(50,drag.sy+e.clientY-drag.y));if($(ids[0]))$(ids[0]).value=Math.round(nx);if($(ids[1]))$(ids[1]).value=Math.round(ny);sync();});
     const stop=()=>{drag=null;el.classList.remove('dragging');};
     el.addEventListener('pointerup',stop);el.addEventListener('pointercancel',stop);
   });
 }
 function refreshAppearancePreviews(){
   appearance.logoSlots=normalizeLogoSlots(appearance.logoSlots);
   setupLogoSlot('logoLightPreview',appearance.logoLightUrl,'mainLight');
   setupLogoSlot('logoDarkPreview',appearance.logoDarkUrl,'mainDark');
   bindLogoSlotControls();
   setPreview('heroLightPreview',appearance.heroLightUrl,'appearance-hero-preview','Hero clair');
   setPreview('heroDarkPreview',appearance.heroDarkUrl,'appearance-hero-preview','Hero sombre');
   setPreview('backgroundLightPreview',appearance.backgroundLightUrl,'appearance-hero-preview','Arrière-plan clair');
   setPreview('backgroundDarkPreview',appearance.backgroundDarkUrl,'appearance-hero-preview','Arrière-plan sombre');
   const sl=$('heroSideLight'),sd=$('heroSideDark');
   if(sl) sl.style.backgroundImage=appearance.heroLightUrl?`url("${appearance.heroLightUrl}")`:'';
   if(sd) sd.style.backgroundImage=appearance.heroDarkUrl?`url("${appearance.heroDarkUrl}")`:'';
 }
 const STORE_ICON_DEFAULTS={
   dtf:{emoji:'▣'},fabric:{emoji:'♢'},delivery:{emoji:'▱'},support:{emoji:'◌'},cart:{emoji:'🛒'},payment:{emoji:'💳'},facebook:{emoji:'f'},instagram:{emoji:'◎'},tiktok:{emoji:'♪'},search:{emoji:'🔍'},deliveryHome:{emoji:'🏠'},deliveryOffice:{emoji:'🏢'},theme:{light:'🌙',dark:'☀️'}
 };
 const STORE_ICON_KEYS=['dtf','fabric','delivery','support','cart','payment','facebook','instagram','tiktok','search','deliveryHome','deliveryOffice'];
 function normalizeStoreIcons(raw){
   const src=raw||{}; const out={};
   STORE_ICON_KEYS.forEach(k=>{
     const d=STORE_ICON_DEFAULTS[k]; const old=src[k];
     const light=old?.light||old?.clair||((old&&old.mode)?old:null);
     const dark=old?.dark||old?.sombre||((old&&old.mode)?old:null);
     out[k]={light:{mode:light?.mode==='png'?'png':'emoji',emoji:light?.emoji||d.emoji,pngUrl:light?.pngUrl||''},dark:{mode:dark?.mode==='png'?'png':'emoji',emoji:dark?.emoji||d.emoji,pngUrl:dark?.pngUrl||''}};
   });
   const oldTheme=src.theme||{};
   const tl=src.themeLight||oldTheme.light||{mode:'emoji',emoji:'🌙',pngUrl:''};
   const td=src.themeDark||oldTheme.dark||{mode:'emoji',emoji:'☀️',pngUrl:''};
   out.theme={light:{mode:tl.mode==='png'?'png':'emoji',emoji:tl.emoji||'🌙',pngUrl:tl.pngUrl||''},dark:{mode:td.mode==='png'?'png':'emoji',emoji:td.emoji||'☀️',pngUrl:td.pngUrl||''}};
   return out;
 }
 function fillStoreIconEditor(key,labelKey){
   const item=appearance.icons?.[labelKey]||appearance.icons?.[key]||normalizeStoreIcons(appearance.icons)[key];
   ['Light','Dark'].forEach(mode=>{
     const side=mode==='Light'?'light':'dark', icon=item?.[side]||{};
     const m=$('iconMode'+mode+labelKey), e=$('icon'+mode+labelKey), f=$('iconPng'+mode+labelKey), pv=$('iconPreview'+mode+labelKey);
     if(m)m.value=icon.mode==='png'?'png':'emoji'; if(e)e.value=icon.emoji||''; if(f)f.value='';
     if(pv)pv.innerHTML=(icon.mode==='png'&&icon.pngUrl)?`<img src="${icon.pngUrl}" alt="">`:`<span>${icon.emoji||''}</span>`;
     const ew=$('iconEmojiWrap'+mode+labelKey), pw=$('iconPngWrap'+mode+labelKey); if(ew)ew.style.display=icon.mode==='png'?'none':'block'; if(pw)pw.style.display=icon.mode==='png'?'block':'none';
   });
 }
 async function loadAppearance(){
   const settings=await window.ArtwearStore.getStoreSettings();
   appearance=settings.appearance||{logoLightUrl:'',logoDarkUrl:'',logoUrl:'',heroLightUrl:'',heroDarkUrl:'',heroUrl:'',categories:{}}; appearance.sizeGuides=normalizeSizeGuides(appearance.sizeGuides); renderSizeGuidesPanel(); renderProductSizeGuideSelect();
   appearance.logoLightUrl=appearance.logoLightUrl||appearance.logoUrl||'';
   appearance.logoDarkUrl=appearance.logoDarkUrl||appearance.logoUrl||'';
   appearance.logoSlots=normalizeLogoSlots(appearance.logoSlots);
   // Keep Hero images independent: legacy heroUrl is not copied into both modes.
   appearance.heroLightUrl=appearance.heroLightUrl||'';
   appearance.heroDarkUrl=appearance.heroDarkUrl||'';
   appearance.heroText={
     eyebrow:String(appearance.heroText?.eyebrow ?? 'ANIME · SPORT · GAMING · CULTURE'),
     title:String(appearance.heroText?.title ?? 'PORTE CE\nQUE TU\nAIMES'),
     description:String(appearance.heroText?.description ?? 'Des designs uniques pour les passionnés d’anime, de sport, de gaming et de culture.')
   };
   if($('heroEyebrowText'))$('heroEyebrowText').value=appearance.heroText.eyebrow;
   if($('heroTitleText'))$('heroTitleText').value=appearance.heroText.title;
   if($('heroDescriptionText'))$('heroDescriptionText').value=appearance.heroText.description;
   appearance.backgroundLightUrl=appearance.backgroundLightUrl||'assets/background-light.png';
   appearance.backgroundDarkUrl=appearance.backgroundDarkUrl||'assets/background-noir.png';
   appearance.categories=appearance.categories||{};
   appearance.integrations={googleSheetsUrl:String(appearance.integrations?.googleSheetsUrl||''),metaPixelId:String(appearance.integrations?.metaPixelId||'')};
   appearance.storeFont={url:String(appearance.storeFont?.url||''),fileName:String(appearance.storeFont?.fileName||'')};
   appearance.storeFontSizes={small:Math.max(80,Math.min(125,Number(appearance.storeFontSizes?.small)||100)),large:Math.max(80,Math.min(125,Number(appearance.storeFontSizes?.large)||100))};
   appearance.navPositionX=Math.max(-180,Math.min(180,Number(appearance.navPositionX)||0));
   syncNavPositionControls();
   if($('storeFontName')) $('storeFontName').textContent=appearance.storeFont.url ? ('Police actuelle : '+(appearance.storeFont.fileName||'fichier TTF')) : 'Aucune police personnalisée.';
   appearance.topbar={leftText:String(appearance.topbar?.leftText ?? '💳 Paiement à la livraison'),rightText:String(appearance.topbar?.rightText ?? '🚚 Livraison dans les 58 wilayas'),leftAlign:['left','center','right'].includes(appearance.topbar?.leftAlign)?appearance.topbar.leftAlign:'left',rightAlign:['left','center','right'].includes(appearance.topbar?.rightAlign)?appearance.topbar.rightAlign:'right'};
   appearance.deliveryTexts={title:String(appearance.deliveryTexts?.title ?? 'MODE DE LIVRAISON'),homeTitle:String(appearance.deliveryTexts?.homeTitle ?? 'Livraison à domicile'),homeText:String(appearance.deliveryTexts?.homeText ?? 'Votre adresse complète'),officeTitle:String(appearance.deliveryTexts?.officeTitle ?? 'Livraison au bureau'),officeText:String(appearance.deliveryTexts?.officeText ?? 'Point / bureau de livraison')};
   ensureAppearanceI18n();
   appearance.checkoutTexts={
     title:String(appearance.checkoutTexts?.title ?? 'INFORMATIONS DE LIVRAISON'),
     subtitle:String(appearance.checkoutTexts?.subtitle ?? 'Choisissez le mode de livraison puis remplissez vos informations.'),
     nameLabel:String(appearance.checkoutTexts?.nameLabel ?? 'Nom et prénom'), namePlaceholder:String(appearance.checkoutTexts?.namePlaceholder ?? 'Ex: Mohamed Ali'),
     phoneLabel:String(appearance.checkoutTexts?.phoneLabel ?? 'Numéro de téléphone'), phonePlaceholder:String(appearance.checkoutTexts?.phonePlaceholder ?? '05 / 06 / 07 XX XX XX XX'),
     wilayaLabel:String(appearance.checkoutTexts?.wilayaLabel ?? 'Wilaya'), wilayaPlaceholder:String(appearance.checkoutTexts?.wilayaPlaceholder ?? 'Choisir'),
     communeLabel:String(appearance.checkoutTexts?.communeLabel ?? 'Commune'), communePlaceholder:String(appearance.checkoutTexts?.communePlaceholder ?? 'Choisir la commune'),
     officeLabel:String(appearance.checkoutTexts?.officeLabel ?? 'Bureau / point de livraison'), officePlaceholder:String(appearance.checkoutTexts?.officePlaceholder ?? 'Choisir le bureau'),
     addressLabel:String(appearance.checkoutTexts?.addressLabel ?? 'Adresse complète'), addressPlaceholder:String(appearance.checkoutTexts?.addressPlaceholder ?? 'Cité, rue, numéro...'),
     paymentTitle:String(appearance.checkoutTexts?.paymentTitle ?? 'PAIEMENT'), paymentMethod:String(appearance.checkoutTexts?.paymentMethod ?? 'Paiement à la livraison'), paymentDescription:String(appearance.checkoutTexts?.paymentDescription ?? 'Vous payez à la réception de votre colis.'),
     submitButton:String(appearance.checkoutTexts?.submitButton ?? 'CONFIRMER LA COMMANDE'), summaryTitle:String(appearance.checkoutTexts?.summaryTitle ?? 'VOTRE COMMANDE'),
     subtotalLabel:String(appearance.checkoutTexts?.subtotalLabel ?? 'Sous-total'), shippingLabel:String(appearance.checkoutTexts?.shippingLabel ?? 'Livraison'), totalLabel:String(appearance.checkoutTexts?.totalLabel ?? 'Total')
   };
   appearance.icons=normalizeStoreIcons(appearance.icons||{});
   if($('topbarLeftText'))$('topbarLeftText').value=appearance.topbar.leftText;
   if($('topbarRightText'))$('topbarRightText').value=appearance.topbar.rightText;
   if($('topbarLeftAlign'))$('topbarLeftAlign').value=appearance.topbar.leftAlign;
   if($('topbarRightAlign'))$('topbarRightAlign').value=appearance.topbar.rightAlign;
   if($('deliveryTextTitle'))$('deliveryTextTitle').value=appearance.deliveryTexts.title;
   if($('deliveryHomeTitle'))$('deliveryHomeTitle').value=appearance.deliveryTexts.homeTitle;
   if($('deliveryHomeText'))$('deliveryHomeText').value=appearance.deliveryTexts.homeText;
   if($('deliveryOfficeTitle'))$('deliveryOfficeTitle').value=appearance.deliveryTexts.officeTitle;
   if($('deliveryOfficeText'))$('deliveryOfficeText').value=appearance.deliveryTexts.officeText;
   const ct=appearance.checkoutTexts;
   const checkoutFields=['title','subtitle','nameLabel','namePlaceholder','phoneLabel','phonePlaceholder','wilayaLabel','wilayaPlaceholder','communeLabel','communePlaceholder','officeLabel','officePlaceholder','addressLabel','addressPlaceholder','paymentTitle','paymentMethod','paymentDescription','submitButton','summaryTitle','subtotalLabel','shippingLabel','totalLabel'];
   checkoutFields.forEach(k=>{const el=$('checkout'+k.charAt(0).toUpperCase()+k.slice(1));if(el)el.value=ct[k];});
   appearance.socialLinks={
     facebook:String(appearance.socialLinks?.facebook||''),
     instagram:String(appearance.socialLinks?.instagram||''),
     tiktok:String(appearance.socialLinks?.tiktok||'')
   };
   if($('googleSheetsUrl'))$('googleSheetsUrl').value=appearance.integrations.googleSheetsUrl;
   if($('metaPixelId'))$('metaPixelId').value=appearance.integrations.metaPixelId;
   if($('socialFacebookUrl'))$('socialFacebookUrl').value=appearance.socialLinks.facebook;
   if($('socialInstagramUrl'))$('socialInstagramUrl').value=appearance.socialLinks.instagram;
   if($('socialTiktokUrl'))$('socialTiktokUrl').value=appearance.socialLinks.tiktok;
   updateIntegrationStatus();
   appearance.storeTexts={...getDefaultStoreTexts(),...(appearance.storeTexts||{})}; renderStoreTextsEditor();
   appearance.homeFeatures=Array.isArray(appearance.homeFeatures)?appearance.homeFeatures:[];
   const defaultFeatures=[
     {title:'IMPRESSION DTF',text:'Haute qualité',iconLight:{mode:'emoji',emoji:'▣',pngUrl:''},iconDark:{mode:'emoji',emoji:'▣',pngUrl:''}},
     {title:'TISSUS PREMIUM',text:'Confort garanti',iconLight:{mode:'emoji',emoji:'♢',pngUrl:''},iconDark:{mode:'emoji',emoji:'♢',pngUrl:''}},
     {title:'LIVRAISON 58 WILAYAS',text:'Paiement à la livraison',iconLight:{mode:'emoji',emoji:'▱',pngUrl:''},iconDark:{mode:'emoji',emoji:'▱',pngUrl:''}},
     {title:'SERVICE CLIENT 7/7',text:'Nous sommes là pour vous',iconLight:{mode:'emoji',emoji:'◌',pngUrl:''},iconDark:{mode:'emoji',emoji:'◌',pngUrl:''}}
   ];
   appearance.homeFeatures=defaultFeatures.map((d,i)=>{
     const saved=appearance.homeFeatures[i]||{};
     return {...d,...saved,iconLight:{...d.iconLight,...(saved.iconLight||{})},iconDark:{...d.iconDark,...(saved.iconDark||{})}};
   });
   appearance.homeFeaturesBar={
     light:{background:/^#[0-9a-fA-F]{6}$/.test(String(appearance.homeFeaturesBar?.light?.background||''))?appearance.homeFeaturesBar.light.background:'#ffffff',opacity:Math.max(0,Math.min(1,Number(appearance.homeFeaturesBar?.light?.opacity ?? .06)))},
     dark:{background:/^#[0-9a-fA-F]{6}$/.test(String(appearance.homeFeaturesBar?.dark?.background||''))?appearance.homeFeaturesBar.dark.background:'#ffffff',opacity:Math.max(0,Math.min(1,Number(appearance.homeFeaturesBar?.dark?.opacity ?? .05)))}
   };
   if($('featuresBarBgLight'))$('featuresBarBgLight').value=appearance.homeFeaturesBar.light.background;
   if($('featuresBarBgDark'))$('featuresBarBgDark').value=appearance.homeFeaturesBar.dark.background;
   if($('featuresBarOpacityLight'))$('featuresBarOpacityLight').value=Math.round(appearance.homeFeaturesBar.light.opacity*100);
   if($('featuresBarOpacityDark'))$('featuresBarOpacityDark').value=Math.round(appearance.homeFeaturesBar.dark.opacity*100);
   if($('featuresBarOpacityLightValue'))$('featuresBarOpacityLightValue').textContent=Math.round(appearance.homeFeaturesBar.light.opacity*100)+'%';
   if($('featuresBarOpacityDarkValue'))$('featuresBarOpacityDarkValue').textContent=Math.round(appearance.homeFeaturesBar.dark.opacity*100)+'%';
   const defaultSiteBars={topbar:{light:{background:'#f5f5f5',opacity:1},dark:{background:'#101010',opacity:1}},header:{light:{background:'#f5f5f5',opacity:1},dark:{background:'#101010',opacity:1}},footer:{light:{background:'#f5f5f5',opacity:1},dark:{background:'#101010',opacity:1}}};
   const savedSiteBars=appearance.siteBars||{};
   appearance.siteBars={};
   ['topbar','header','footer'].forEach(key=>{
     appearance.siteBars[key]={};
     ['light','dark'].forEach(mode=>{
       const d=defaultSiteBars[key][mode], saved=savedSiteBars?.[key]?.[mode]||{};
       appearance.siteBars[key][mode]={background:/^#[0-9a-fA-F]{6}$/.test(String(saved.background||''))?saved.background:d.background,opacity:Math.max(0,Math.min(1,Number(saved.opacity ?? d.opacity)))};
     });
   });
   const defaultCardStyles={productCard:{light:{background:'#ffffff',opacity:.06},dark:{background:'#ffffff',opacity:.05}},productInfo:{light:{background:'#ffffff',opacity:.06},dark:{background:'#ffffff',opacity:.05}},productServices:{light:{background:'#ffffff',opacity:.05},dark:{background:'#ffffff',opacity:.04}},checkoutSteps:{light:{background:'#ffffff',opacity:.05},dark:{background:'#ffffff',opacity:.04}},cartReview:{light:{background:'#ffffff',opacity:.05},dark:{background:'#ffffff',opacity:.04}},cartItem:{light:{background:'#ffffff',opacity:.04},dark:{background:'#ffffff',opacity:.035}},deliveryInfo:{light:{background:'#ffffff',opacity:.06},dark:{background:'#ffffff',opacity:.05}},deliveryMode:{light:{background:'#ffffff',opacity:.04},dark:{background:'#ffffff',opacity:.035}},payment:{light:{background:'#ffffff',opacity:.04},dark:{background:'#ffffff',opacity:.035}},summary:{light:{background:'#ffffff',opacity:.06},dark:{background:'#ffffff',opacity:.05}}};
   const savedCardStyles=appearance.cardStyles||{}; appearance.sizeGuides=normalizeSizeGuides(appearance.sizeGuides);
     appearance.cardStyles={};
   Object.keys(defaultCardStyles).forEach(key=>{appearance.cardStyles[key]={};['light','dark'].forEach(mode=>{const d=defaultCardStyles[key][mode],saved=savedCardStyles?.[key]?.[mode]||{};appearance.cardStyles[key][mode]={background:/^#[0-9a-fA-F]{6}$/.test(String(saved.background||''))?saved.background:d.background,opacity:Math.max(0,Math.min(1,Number(saved.opacity ?? d.opacity)))};});});
   Object.entries(cardFieldMap).forEach(([key,label])=>['Light','Dark'].forEach(mode=>{const cfg=appearance.cardStyles[key][mode.toLowerCase()];const bg=$('card'+label+mode+'Bg'),op=$('card'+label+mode+'Opacity'),out=$('card'+label+mode+'OpacityValue');if(bg)bg.value=cfg.background;if(op)op.value=Math.round(cfg.opacity*100);if(out)out.textContent=Math.round(cfg.opacity*100)+'%';}));

   const siteBarFields=[['Top','topbar'],['Header','header'],['Footer','footer']];
   siteBarFields.forEach(([label,key])=>['Light','Dark'].forEach(mode=>{
     const cfg=appearance.siteBars[key][mode.toLowerCase()], bg=$('siteBar'+label+mode+'Bg'), op=$('siteBar'+label+mode+'Opacity'), out=$('siteBar'+label+mode+'OpacityValue');
     if(bg)bg.value=cfg.background; if(op)op.value=Math.round(cfg.opacity*100); if(out)out.textContent=Math.round(cfg.opacity*100)+'%';
   }));
   // V91.1 — keep the three site-bar controls in sync and preview opacity values immediately.
   siteBarFields.forEach(([label,key])=>['Light','Dark'].forEach(mode=>{
     const bg=$('siteBar'+label+mode+'Bg'), op=$('siteBar'+label+mode+'Opacity'), out=$('siteBar'+label+mode+'OpacityValue');
     if(op && out && !op.dataset.awBound){
       op.addEventListener('input',()=>{out.textContent=Math.round(Number(op.value||0))+'%';});
       op.dataset.awBound='1';
     }
     if(bg && !bg.dataset.awBound){
       bg.addEventListener('input',()=>{ 
         // Preview is intentionally local; persisted values are applied after Save.
         const v=bg.value;
         if(v) bg.title='Couleur sélectionnée : '+v;
       });
       bg.dataset.awBound='1';
     }
   }));
   appearance.homeFeatures.forEach((f,i)=>{ 
     if($('featureTitle'+(i+1)))$('featureTitle'+(i+1)).value=f.title||'';
     if($('featureText'+(i+1)))$('featureText'+(i+1)).value=f.text||'';
     [['Light',f.iconLight,'▣'],['Dark',f.iconDark,'▣']].forEach(([mode,icon,def])=>{
       const m=$('featureIconMode'+mode+(i+1)),e=$('featureIcon'+mode+(i+1)),file=$('featureIconPng'+mode+(i+1)),preview=$('featureIconPreview'+mode+(i+1));
       if(m)m.value=icon.mode==='png'?'png':'emoji';
       if(e)e.value=icon.emoji||def;
       if(file)file.value='';
       if(preview)preview.innerHTML=(icon.mode==='png'&&icon.pngUrl)?`<img src="${icon.pngUrl}" alt="">`:`<span>${icon.emoji||def}</span>`;
       const ew=$('featureIconEmojiWrap'+mode+(i+1)),pw=$('featureIconPngWrap'+mode+(i+1));
       if(ew)ew.style.display=icon.mode==='png'?'none':'block';
       if(pw)pw.style.display=icon.mode==='png'?'block':'none';
     });
   });
   const defaultProductServices=[
     {title:'58 wilayas',text:'Livraison',iconLight:{mode:'emoji',emoji:'🚚',pngUrl:''},iconDark:{mode:'emoji',emoji:'🚚',pngUrl:''}},
     {title:'À la livraison',text:'Paiement',iconLight:{mode:'emoji',emoji:'💳',pngUrl:''},iconDark:{mode:'emoji',emoji:'💳',pngUrl:''}},
     {title:'DTF Premium',text:'Qualité',iconLight:{mode:'emoji',emoji:'✓',pngUrl:''},iconDark:{mode:'emoji',emoji:'✓',pngUrl:''}}
   ];
   appearance.productServices=defaultProductServices.map((d,i)=>{const saved=appearance.productServices?.[i]||{};return {...d,...saved,iconLight:{...d.iconLight,...(saved.iconLight||{})},iconDark:{...d.iconDark,...(saved.iconDark||{})}};});
   appearance.productServices.forEach((f,i)=>{
     if($('productServiceTitle'+(i+1)))$('productServiceTitle'+(i+1)).value=f.title||'';
     if($('productServiceText'+(i+1)))$('productServiceText'+(i+1)).value=f.text||'';
     [['Light',f.iconLight,'🚚'],['Dark',f.iconDark,'🚚']].forEach(([mode,icon,def])=>{
       const m=$('productServiceIconMode'+mode+(i+1)),e=$('productServiceIcon'+mode+(i+1)),file=$('productServiceIconPng'+mode+(i+1)),preview=$('productServiceIconPreview'+mode+(i+1));
       if(m)m.value=icon.mode==='png'?'png':'emoji'; if(e)e.value=icon.emoji||def; if(file)file.value='';
       if(preview)preview.innerHTML=(icon.mode==='png'&&icon.pngUrl)?`<img src="${icon.pngUrl}" alt="">`:`<span>${icon.emoji||def}</span>`;
       const ew=$('productServiceIconEmojiWrap'+mode+(i+1)),pw=$('productServiceIconPngWrap'+mode+(i+1)); if(ew)ew.style.display=icon.mode==='png'?'none':'block'; if(pw)pw.style.display=icon.mode==='png'?'block':'none';
     });
   });
   applyAppearanceLanguageToPanel(appearanceEditLang);
   setCategoryList(normalizeCategories(appearance.categoryList,appearance.categories));
   appearance.icons=normalizeStoreIcons(appearance.icons||{});
   [['Dtf','dtf'],['Fabric','fabric'],['Delivery','delivery'],['Support','support'],['Cart','cart'],['Payment','payment'],['Facebook','facebook'],['Instagram','instagram'],['Tiktok','tiktok'],['Search','search'],['DeliveryHome','deliveryHome'],['DeliveryOffice','deliveryOffice']].forEach(([label,key])=>fillStoreIconEditor(label,key));
   fillStoreIconEditor('theme','theme');
   refreshAppearancePreviews();
   const cats=getCategoryList().sort((a,b)=>a.order-b.order);
   $('categoryMedia').innerHTML=cats.map(c=>`<div class="media-card"><div class="media-card-title"><b>${esc(c.name)}</b><small>${c.showOnHome?'Accueil':'Pas sur accueil'}</small></div><div class="media-thumb">${c.imageUrl?`<img src="${esc(c.imageUrl)}" alt="${esc(c.name)}">`:'<span>Aucune image</span>'}</div><label class="upload-btn small-upload">↥ Changer l’image<input type="file" accept="image/png,image/jpeg,image/webp" data-category-file="${esc(c.id)}"></label><button type="button" class="delete-btn small-upload" data-category-image-delete="${esc(c.id)}">♜ Supprimer l’image</button></div>`).join('');
   document.querySelectorAll('[data-category-image-delete]').forEach(b=>b.onclick=async()=>{const c=categoryById(b.dataset.categoryImageDelete);if(c){c.imageUrl='';try{await saveCategorySettings('Image supprimée.');loadAppearance();}catch(e){$('appearanceMsg').className='error';$('appearanceMsg').textContent=e.message;}}});
 }
 function mergePages(raw){
   const a=raw?.about||{},c=raw?.contact||{},t=raw?.terms||{},h=raw?.howToOrder||{};
   const generic=(base,rawPage)=>({...base,...rawPage});
   return {about:{...DEFAULT_PAGES.about,...a,values:Array.from({length:3},(_,i)=>({...DEFAULT_PAGES.about.values[i],...(a.values?.[i]||{})}))},contact:{...DEFAULT_PAGES.contact,...c},terms:generic(DEFAULT_PAGES.terms,t),howToOrder:generic(DEFAULT_PAGES.howToOrder,h),orderSuccess:{title:'COMMANDE CONFIRMÉE',orderNumber:'Votre numéro de commande est {{orderId}}.',delivery:'Livraison : {{delivery}} — {{price}}',contact:'Nous vous contacterons au {{phone}}.',homeButton:'RETOUR À L’ACCUEIL',...(raw?.orderSuccess||{})}};
 }
 let pagesEditLang='fr';
 function getPagesForLanguage(appearanceObj,lang){
   const legacy=appearanceObj?.pages||{};
   const bilingual=appearanceObj?.pagesI18n||{};
   if(lang==='ar') return mergePages(bilingual.ar||{});
   return mergePages(bilingual.fr||legacy);
 }
 function updatePagesLanguageUI(){
   document.querySelectorAll('[data-pages-lang]').forEach(b=>b.classList.toggle('active',b.dataset.pagesLang===pagesEditLang));
   const badge=$('pagesLanguageBadge'),hint=$('pagesLanguageHint');
   if(badge) badge.textContent=pagesEditLang==='ar'?'العربية 🇩🇿':'FRANÇAIS 🇫🇷';
   if(hint) hint.textContent=pagesEditLang==='ar'?'أنت تعدّل الآن النسخة العربية من صفحات المتجر.':'Vous modifiez actuellement la version française des pages.';
   document.documentElement.dir=pagesEditLang==='ar'?'rtl':'ltr';
 }
 function setPageEditor(id,value){const el=$(id);if(el)el.value=value??'';}
 function loadPageEditor(p){
   const a=p.about,c=p.contact,t=p.terms,h=p.howToOrder,o=p.orderSuccess||{};
   const fields=[['aboutEyebrow',a.eyebrow],['aboutTitle',a.title],['aboutIntro',a.intro],['aboutStoryTitle',a.storyTitle],['aboutStoryText',a.storyText],['aboutMissionTitle',a.missionTitle],['aboutMissionText',a.missionText],['aboutValue1Title',a.values[0].title],['aboutValue1Text',a.values[0].text],['aboutValue2Title',a.values[1].title],['aboutValue2Text',a.values[1].text],['aboutValue3Title',a.values[2].title],['aboutValue3Text',a.values[2].text],['aboutCtaText',a.ctaText],['aboutCtaLink',a.ctaLink],['contactEyebrow',c.eyebrow],['contactTitle',c.title],['contactIntro',c.intro],['contactEmail',c.email],['contactPhone',c.phone],['contactAddress',c.address],['contactHours',c.hours],['contactFormTitle',c.formTitle],['contactFormButton',c.formButton],['contactFormNote',c.formNote],['contactSuccess',c.success],['contactFacebook',c.facebook],['contactInstagram',c.instagram],['contactTiktok',c.tiktok],['termsEyebrow',t.eyebrow],['termsTitle',t.title],['termsIntro',t.intro],['termsBody',t.body],['termsCtaText',t.ctaText],['termsCtaLink',t.ctaLink],['howToOrderEyebrow',h.eyebrow],['howToOrderTitle',h.title],['howToOrderIntro',h.intro],['howToOrderBody',h.body],['howToOrderCtaText',h.ctaText],['howToOrderCtaLink',h.ctaLink],['orderSuccessTitle',o.title],['orderSuccessOrderNumber',o.orderNumber],['orderSuccessDelivery',o.delivery],['orderSuccessContact',o.contact],['orderSuccessHomeButton',o.homeButton]];
   fields.forEach(([id,v])=>setPageEditor(id,v));
   updatePagesLanguageUI();
 }
 async function loadPages(){
   try{const settings=await window.ArtwearStore.getStoreSettings();appearance=settings.appearance||appearance;appearance.sizeGuides=normalizeSizeGuides(appearance.sizeGuides);renderSizeGuidesPanel();renderProductSizeGuideSelect();appearance.pages=mergePages(appearance.pages);if(!appearance.pagesI18n)appearance.pagesI18n={fr:appearance.pages,ar:{}};if(!appearance.pagesI18n.fr)appearance.pagesI18n.fr=appearance.pages;loadPageEditor(getPagesForLanguage(appearance,pagesEditLang));if($('pagesMsg')){$('pagesMsg').className='';$('pagesMsg').textContent='';}}catch(e){if($('pagesMsg')){$('pagesMsg').className='error';$('pagesMsg').textContent=e.message;}}
 }
 function readPageEditor(){
   const a={eyebrow:$('aboutEyebrow')?.value.trim()||DEFAULT_PAGES.about.eyebrow,title:$('aboutTitle')?.value.trim()||DEFAULT_PAGES.about.title,intro:$('aboutIntro')?.value.trim()||'',storyTitle:$('aboutStoryTitle')?.value.trim()||'',storyText:$('aboutStoryText')?.value.trim()||'',missionTitle:$('aboutMissionTitle')?.value.trim()||'',missionText:$('aboutMissionText')?.value.trim()||'',values:[1,2,3].map(i=>({title:$('aboutValue'+i+'Title')?.value.trim()||'',text:$('aboutValue'+i+'Text')?.value.trim()||''})),ctaText:$('aboutCtaText')?.value.trim()||'',ctaLink:$('aboutCtaLink')?.value.trim()||'boutique.html'};
   const c={eyebrow:$('contactEyebrow')?.value.trim()||'',title:$('contactTitle')?.value.trim()||'',intro:$('contactIntro')?.value.trim()||'',email:$('contactEmail')?.value.trim()||'',phone:$('contactPhone')?.value.trim()||'',address:$('contactAddress')?.value.trim()||'',hours:$('contactHours')?.value.trim()||'',formTitle:$('contactFormTitle')?.value.trim()||'',formButton:$('contactFormButton')?.value.trim()||'',formNote:$('contactFormNote')?.value.trim()||'',success:$('contactSuccess')?.value.trim()||'',facebook:$('contactFacebook')?.value.trim()||'',instagram:$('contactInstagram')?.value.trim()||'',tiktok:$('contactTiktok')?.value.trim()||''};
   const terms={eyebrow:$('termsEyebrow')?.value.trim()||DEFAULT_PAGES.terms.eyebrow,title:$('termsTitle')?.value.trim()||DEFAULT_PAGES.terms.title,intro:$('termsIntro')?.value.trim()||'',body:$('termsBody')?.value||'',ctaText:$('termsCtaText')?.value.trim()||'',ctaLink:$('termsCtaLink')?.value.trim()||'boutique.html'};
   const howToOrder={eyebrow:$('howToOrderEyebrow')?.value.trim()||DEFAULT_PAGES.howToOrder.eyebrow,title:$('howToOrderTitle')?.value.trim()||DEFAULT_PAGES.howToOrder.title,intro:$('howToOrderIntro')?.value.trim()||'',body:$('howToOrderBody')?.value||'',ctaText:$('howToOrderCtaText')?.value.trim()||'',ctaLink:$('howToOrderCtaLink')?.value.trim()||'boutique.html'};
   const orderSuccess={title:$('orderSuccessTitle')?.value.trim()||'COMMANDE CONFIRMÉE',orderNumber:$('orderSuccessOrderNumber')?.value.trim()||'Votre numéro de commande est {{orderId}}.',delivery:$('orderSuccessDelivery')?.value.trim()||'Livraison : {{delivery}} — {{price}}',contact:$('orderSuccessContact')?.value.trim()||'Nous vous contacterons au {{phone}}.',homeButton:$('orderSuccessHomeButton')?.value.trim()||'RETOUR À L’ACCUEIL'};
   return {about:a,contact:c,terms,howToOrder,orderSuccess};
 }
 async function savePages(){
   try{
     const page=readPageEditor();
     appearance.pagesI18n=appearance.pagesI18n||{fr:appearance.pages||mergePages({}),ar:{}};
     if(!appearance.pagesI18n.fr) appearance.pagesI18n.fr=appearance.pages||mergePages({});
     appearance.pagesI18n[pagesEditLang]=page;
     if(pagesEditLang==='fr') appearance.pages=page; // preserve legacy compatibility
     const {error}=await sb.client.from('store_settings').upsert({id:1,appearance});if(error)throw error;
     if($('pagesMsg')){$('pagesMsg').className='success';$('pagesMsg').textContent=pagesEditLang==='ar'?'تم حفظ الصفحات العربية بنجاح.':'Pages françaises enregistrées avec succès.';}
   }catch(e){if($('pagesMsg')){$('pagesMsg').className='error';$('pagesMsg').textContent=e.message;}}
 }
 document.addEventListener('click',e=>{
   const b=e.target.closest('[data-pages-lang]');
   if(!b)return;
   const next=b.dataset.pagesLang;
   if(next===pagesEditLang)return;
   // Load current saved state before switching, so unsaved edits are never silently mixed.
   pagesEditLang=next;
   loadPages();
 });
 function updateIntegrationStatus(){
   const g=$('googleSheetsStatus'),m=$('metaPixelStatus');
   const gu=($('googleSheetsUrl')?.value||appearance.integrations?.googleSheetsUrl||'').trim();
   const mi=($('metaPixelId')?.value||appearance.integrations?.metaPixelId||'').trim();
   if(g){g.textContent=gu?'✓ Configuré':'Non configuré';g.classList.toggle('ok',!!gu);}
   if(m){m.textContent=mi?'✓ Configuré':'Non configuré';m.classList.toggle('ok',!!mi);}
 }
 async function saveIntegrations(){
   try{
     $('integrationsMsg').className='';$('integrationsMsg').textContent='Enregistrement...';
     const normalizeSocialUrl=(value)=>{
       const v=String(value||'').trim();
       if(!v)return '';
       if(/^https?:\/\//i.test(v))return v;
       if(/^(javascript|data|vbscript):/i.test(v))throw new Error('Lien social non autorisé.');
       return 'https://'+v;
     };
     appearance.integrations={
       googleSheetsUrl:($('googleSheetsUrl')?.value||'').trim(),
       metaPixelId:($('metaPixelId')?.value||'').trim().replace(/\s+/g,'')
     };
     appearance.socialLinks={
       facebook:normalizeSocialUrl($('socialFacebookUrl')?.value),
       instagram:normalizeSocialUrl($('socialInstagramUrl')?.value),
       tiktok:normalizeSocialUrl($('socialTiktokUrl')?.value)
     };
     const {error}=await sb.client.from('store_settings').upsert({id:1,appearance});
     if(error)throw error;
     updateIntegrationStatus();
     $('integrationsMsg').className='success';$('integrationsMsg').textContent='Intégrations enregistrées avec succès.';
   }catch(err){$('integrationsMsg').className='error';$('integrationsMsg').textContent=err.message;}
 }

 async function uploadStoreFontFile(file){
   if(!file) throw new Error('Choisissez un fichier TTF.');
   const name=String(file.name||'font.ttf');
   if(!name.toLowerCase().endsWith('.ttf')) throw new Error('Format de police non autorisé. Utilisez uniquement un fichier .TTF.');
   if(file.size>10*1024*1024) throw new Error('La police est trop volumineuse. Maximum 10 MB.');
   const safe=name.replace(/[^a-z0-9._-]/gi,'_');
   const path=`appearance/store-font_${Date.now()}_${Math.random().toString(36).slice(2,8)}_${safe}`;
   const contentType='font/ttf';
   const fontBucket='product-images';
   // Always rebuild the browser file with an explicit TTF MIME type.
   // This avoids application/octet-stream on browsers that do not identify TTF.
   const bytes=await file.arrayBuffer();
   const typedFile=new File([bytes],safe,{type:contentType,lastModified:Date.now()});
   const {error}=await sb.client.storage.from(fontBucket).upload(path,typedFile,{contentType,upsert:true,cacheControl:'31536000'});
   if(error) throw error;
   return {url:sb.client.storage.from(fontBucket).getPublicUrl(path).data.publicUrl,path,bucket:fontBucket,fileName:safe};
 }
 function storagePathFromPublicUrl(url,bucket='product-images'){
   try{
     const u=new URL(String(url||''));
     const marker=`/storage/v1/object/public/${bucket}/`;
     const i=u.pathname.indexOf(marker);
     return i>=0 ? decodeURIComponent(u.pathname.slice(i+marker.length)) : '';
   }catch(e){ return ''; }
 }
 async function deleteOldStoreFont(url){
   const oldPath=storagePathFromPublicUrl(url,'product-images');
   if(!oldPath) return;
   const {error}=await sb.client.storage.from('product-images').remove([oldPath]);
   if(error) console.warn('Ancienne police non supprimée :',error);
 }
 async function saveStoreFont(){
   const msg=$('storeFontMsg');
   try{
     const file=$('storeFontFile')?.files?.[0];
     const name=String(file?.name||'font.ttf');
     if(!file || !name.toLowerCase().endsWith('.ttf')) throw new Error('Choisissez un fichier .TTF.');
     const oldUrl=String(appearance.storeFont?.url||'');
     // IMPORTANT: upload the new font first. The old font is removed only after
     // the new URL has been successfully persisted in store_settings.
     const uploaded=await uploadStoreFontFile(file);
     const previousAppearance={...appearance,storeFont:{...(appearance.storeFont||{})}};
     appearance.storeFont={url:uploaded.url,fileName:name,path:uploaded.path,bucket:uploaded.bucket};
     const {error}=await sb.client.from('store_settings').upsert({id:1,appearance});
     if(error){
       // Roll back the newly uploaded object if DB persistence fails.
       await sb.client.storage.from(uploaded.bucket).remove([uploaded.path]).catch(()=>{});
       appearance=previousAppearance;
       throw error;
     }
     // New font is safely stored; now remove the old object if it was ours.
     if(oldUrl && oldUrl!==uploaded.url) await deleteOldStoreFont(oldUrl);
     if(msg){msg.className='success';msg.textContent='Nouvelle police enregistrée et ancienne police remplacée avec succès.';}
     if($('storeFontName'))$('storeFontName').textContent='Police actuelle : '+name;
     if($('storeFontFile'))$('storeFontFile').value='';
     previewStoreFont(file);
   }catch(err){if(msg){msg.className='error';msg.textContent=err.message;}}
 }
 async function deleteStoreFont(){
   const msg=$('storeFontMsg');
   try{
     if(!confirm('Supprimer la police personnalisée et revenir à la police par défaut ?')) return;
     const oldUrl=String(appearance.storeFont?.url||'');
     const previousAppearance={...appearance,storeFont:{...(appearance.storeFont||{})}};
     appearance.storeFont={url:'',fileName:''};
     const {error}=await sb.client.from('store_settings').upsert({id:1,appearance});
     if(error){appearance=previousAppearance;throw error;}
     if(oldUrl) await deleteOldStoreFont(oldUrl);
     if(msg){msg.className='success';msg.textContent='Police personnalisée supprimée.';}
     if($('storeFontName'))$('storeFontName').textContent='Aucune police personnalisée.';
     if($('storeFontPreview'))$('storeFontPreview').classList.remove('custom-preview');
   }catch(err){if(msg){msg.className='error';msg.textContent=err.message;}}
 }
 function previewStoreFont(file){
   const pv=$('storeFontPreview'); if(!pv||!file)return;
   const url=URL.createObjectURL(file); const styleId='aw-admin-font-preview-style'; let st=document.getElementById(styleId);
   if(!st){st=document.createElement('style');st.id=styleId;document.head.appendChild(st);}
   st.textContent=`@font-face{font-family:AWAdminPreview;src:url("${url}") format("truetype");font-display:swap}.store-font-preview.custom-preview{--aw-admin-preview-font:AWAdminPreview}`;
   pv.classList.add('custom-preview');
 }
 function syncStoreFontSizeControls(){
   const small=Number(appearance.storeFontSizes?.small)||100, large=Number(appearance.storeFontSizes?.large)||100;
   if($('storeSmallFontSize')) $('storeSmallFontSize').value=small; if($('storeSmallFontSizeValue')) $('storeSmallFontSizeValue').textContent=small+'%';
   if($('storeLargeFontSize')) $('storeLargeFontSize').value=large; if($('storeLargeFontSizeValue')) $('storeLargeFontSizeValue').textContent=large+'%';
 }
 function setStoreFontSize(kind,value){ appearance.storeFontSizes=appearance.storeFontSizes||{small:100,large:100}; appearance.storeFontSizes[kind]=Math.max(80,Math.min(125,Number(value)||100)); syncStoreFontSizeControls(); }
 function syncNavPositionControls(){
   const value=Math.max(-180,Math.min(180,Number(appearance.navPositionX)||0));
   if($('navPositionX')) $('navPositionX').value=value;
   if($('navPositionValue')) $('navPositionValue').textContent=(value>0?'+':'')+value+' px';
 }
 function setNavPosition(value){
   appearance.navPositionX=Math.max(-180,Math.min(180,Number(value)||0));
   syncNavPositionControls();
   if(window.ArtwearAppearance?.applyNavPosition) window.ArtwearAppearance.applyNavPosition(appearance.navPositionX);
 }
 async function saveNavPosition(){
   const msg=$('appearanceMsg');
   appearance.navPositionX=Math.max(-180,Math.min(180,Number($('navPositionX')?.value||0)));
   captureAppearanceLanguage(appearanceEditLang);
   try{ await saveAppearance('Position du menu enregistrée.'); if(msg){msg.className='success';msg.textContent='Position du menu enregistrée.';} }
   catch(e){if(msg){msg.className='error';msg.textContent=e.message;}}
 }
 async function saveStoreFontSizes(){ const msg=$('storeFontSizesMsg'); try{ await saveAppearance('Tailles des écritures enregistrées.'); if(msg){msg.className='success';msg.textContent='Tailles enregistrées.';} }catch(e){if(msg){msg.className='error';msg.textContent=e.message;}} }
 async function saveAppearance(){
   captureAppearanceLanguage(appearanceEditLang);
   try{
     appearance.logoSlots=normalizeLogoSlots(appearance.logoSlots);
     bindLogoSlotControls();

     $('appearanceMsg').className='';$('appearanceMsg').textContent='Enregistrement...';
     const logoLightFile=$('storeLogoLight').files[0]; if(logoLightFile) appearance.logoLightUrl=await uploadAppearanceFile(logoLightFile,'logo-light');
     const logoDarkFile=$('storeLogoDark').files[0]; if(logoDarkFile) appearance.logoDarkUrl=await uploadAppearanceFile(logoDarkFile,'logo-dark');
     appearance.logoUrl=appearance.logoLightUrl||appearance.logoDarkUrl||appearance.logoUrl||'';
     const defaultFeatures=[
       {title:'IMPRESSION DTF',text:'Haute qualité',iconLight:{mode:'emoji',emoji:'▣',pngUrl:''},iconDark:{mode:'emoji',emoji:'▣',pngUrl:''}},
       {title:'TISSUS PREMIUM',text:'Confort garanti',iconLight:{mode:'emoji',emoji:'♢',pngUrl:''},iconDark:{mode:'emoji',emoji:'♢',pngUrl:''}},
       {title:'LIVRAISON 58 WILAYAS',text:'Paiement à la livraison',iconLight:{mode:'emoji',emoji:'▱',pngUrl:''},iconDark:{mode:'emoji',emoji:'▱',pngUrl:''}},
       {title:'SERVICE CLIENT 7/7',text:'Nous sommes là pour vous',iconLight:{mode:'emoji',emoji:'◌',pngUrl:''},iconDark:{mode:'emoji',emoji:'◌',pngUrl:''}}
     ];
     appearance.homeFeatures=defaultFeatures.map((d,i)=>({
       title:(($('featureTitle'+(i+1))?.value||d.title).trim()),
       text:(($('featureText'+(i+1))?.value||d.text).trim()),
       iconLight:{mode:$('featureIconModeLight'+(i+1))?.value==='png'?'png':'emoji',emoji:(($('featureIconLight'+(i+1))?.value || d.iconLight?.emoji || '▣').trim()),pngUrl:appearance.homeFeatures?.[i]?.iconLight?.pngUrl||''},
       iconDark:{mode:$('featureIconModeDark'+(i+1))?.value==='png'?'png':'emoji',emoji:(($('featureIconDark'+(i+1))?.value || d.iconDark?.emoji || '▣').trim()),pngUrl:appearance.homeFeatures?.[i]?.iconDark?.pngUrl||''}
     }));
     const defaultProductServices=[
       {title:'58 wilayas',text:'Livraison',iconLight:{mode:'emoji',emoji:'🚚',pngUrl:''},iconDark:{mode:'emoji',emoji:'🚚',pngUrl:''}},
       {title:'À la livraison',text:'Paiement',iconLight:{mode:'emoji',emoji:'💳',pngUrl:''},iconDark:{mode:'emoji',emoji:'💳',pngUrl:''}},
       {title:'DTF Premium',text:'Qualité',iconLight:{mode:'emoji',emoji:'✓',pngUrl:''},iconDark:{mode:'emoji',emoji:'✓',pngUrl:''}}
     ];
     appearance.productServices=defaultProductServices.map((d,i)=>({
       title:(($('productServiceTitle'+(i+1))?.value||d.title).trim()),
       text:(($('productServiceText'+(i+1))?.value||d.text).trim()),
       iconLight:{mode:$('productServiceIconModeLight'+(i+1))?.value==='png'?'png':'emoji',emoji:(($('productServiceIconLight'+(i+1))?.value||d.iconLight.emoji).trim()),pngUrl:appearance.productServices?.[i]?.iconLight?.pngUrl||''},
       iconDark:{mode:$('productServiceIconModeDark'+(i+1))?.value==='png'?'png':'emoji',emoji:(($('productServiceIconDark'+(i+1))?.value||d.iconDark.emoji).trim()),pngUrl:appearance.productServices?.[i]?.iconDark?.pngUrl||''}
     }));
     appearance.sizeGuides=normalizeSizeGuides(appearance.sizeGuides);
     appearance.cardStyles={};
     Object.entries(cardFieldMap).forEach(([key,label])=>{
       appearance.cardStyles[key]={light:{background:$('card'+label+'LightBg')?.value||'#ffffff',opacity:Math.max(0,Math.min(1,Number($('card'+label+'LightOpacity')?.value||0)/100))},dark:{background:$('card'+label+'DarkBg')?.value||'#ffffff',opacity:Math.max(0,Math.min(1,Number($('card'+label+'DarkOpacity')?.value||0)/100))}};
     });
     appearance.homeFeaturesBar={
       light:{background:$('featuresBarBgLight')?.value||'#ffffff',opacity:Math.max(0,Math.min(1,Number($('featuresBarOpacityLight')?.value||6)/100))},
       dark:{background:$('featuresBarBgDark')?.value||'#ffffff',opacity:Math.max(0,Math.min(1,Number($('featuresBarOpacityDark')?.value||5)/100))}
     };
     appearance.navPositionX=Math.max(-180,Math.min(180,Number($('navPositionX')?.value ?? appearance.navPositionX ?? 0)));
     const siteBarDefaults={topbar:{light:'#f5f5f5',dark:'#101010'},header:{light:'#f5f5f5',dark:'#101010'},footer:{light:'#f5f5f5',dark:'#101010'}};
     const siteBarFieldMap={
       topbar:{lightBg:'siteBarTopLightBg',lightOpacity:'siteBarTopLightOpacity',darkBg:'siteBarTopDarkBg',darkOpacity:'siteBarTopDarkOpacity'},
       header:{lightBg:'siteBarHeaderLightBg',lightOpacity:'siteBarHeaderLightOpacity',darkBg:'siteBarHeaderDarkBg',darkOpacity:'siteBarHeaderDarkOpacity'},
       footer:{lightBg:'siteBarFooterLightBg',lightOpacity:'siteBarFooterLightOpacity',darkBg:'siteBarFooterDarkBg',darkOpacity:'siteBarFooterDarkOpacity'}
     };
     appearance.siteBars=appearance.siteBars||{};
     ['topbar','header','footer'].forEach(key=>{
       const f=siteBarFieldMap[key], old=appearance.siteBars[key]||{};
       const lightBg=$(f.lightBg)?.value || old.light?.background || siteBarDefaults[key].light;
       const darkBg=$(f.darkBg)?.value || old.dark?.background || siteBarDefaults[key].dark;
       const lightOpacity=Math.max(0,Math.min(1,Number($(f.lightOpacity)?.value ?? (old.light?.opacity ?? 1))/100));
       const darkOpacity=Math.max(0,Math.min(1,Number($(f.darkOpacity)?.value ?? (old.dark?.opacity ?? 1))/100));
       appearance.siteBars[key]={
         light:{background:/^#[0-9a-fA-F]{6}$/.test(String(lightBg))?lightBg:siteBarDefaults[key].light,opacity:lightOpacity},
         dark:{background:/^#[0-9a-fA-F]{6}$/.test(String(darkBg))?darkBg:siteBarDefaults[key].dark,opacity:darkOpacity}
       };
     });
     for(let i=0;i<4;i++){
       for(const mode of ['Light','Dark']){
         const key=mode==='Light'?'iconLight':'iconDark';
         const file=$('featureIconPng'+mode+(i+1))?.files?.[0];
         if(file) appearance.homeFeatures[i][key].pngUrl=await uploadAppearanceFile(file,'feature-'+mode.toLowerCase()+'-'+(i+1),{allowed:['image/png']});
       }
     }
     for(let i=0;i<3;i++){
       for(const mode of ['Light','Dark']){
         const key=mode==='Light'?'iconLight':'iconDark';
         const file=$('productServiceIconPng'+mode+(i+1))?.files?.[0];
         if(file) appearance.productServices[i][key].pngUrl=await uploadAppearanceFile(file,'product-service-'+mode.toLowerCase()+'-'+(i+1),{allowed:['image/png']});
       }
     }
     appearance.heroText={
       eyebrow:String($('heroEyebrowText')?.value ?? 'ANIME · SPORT · GAMING · CULTURE').trim(),
       title:String($('heroTitleText')?.value ?? 'PORTE CE\nQUE TU\nAIMES').trim(),
       description:String($('heroDescriptionText')?.value ?? 'Des designs uniques pour les passionnés d’anime, de sport, de gaming et de culture.').trim()
     };
     const heroLightFile=$('heroImageLight').files[0]; if(heroLightFile) appearance.heroLightUrl=await uploadAppearanceFile(heroLightFile,'hero-light');
     const heroDarkFile=$('heroImageDark').files[0]; if(heroDarkFile) appearance.heroDarkUrl=await uploadAppearanceFile(heroDarkFile,'hero-dark');
     const backgroundLightFile=$('backgroundImageLight')?.files?.[0]; if(backgroundLightFile) appearance.backgroundLightUrl=await uploadAppearanceFile(backgroundLightFile,'background-light');
     const backgroundDarkFile=$('backgroundImageDark')?.files?.[0]; if(backgroundDarkFile) appearance.backgroundDarkUrl=await uploadAppearanceFile(backgroundDarkFile,'background-dark');
     appearance.heroUrl='';
     appearance.categories=appearance.categories||{};
     // Always rebuild the complete icon tree before writing individual Light/Dark values.
     // This prevents "Cannot set properties of undefined (setting 'light')" when an older
     // appearance record does not contain one of the newer delivery/search/theme keys.
     appearance.icons=normalizeStoreIcons(appearance.icons||{});
     const ensureIconNode=(key)=>{
       if(!appearance.icons[key] || typeof appearance.icons[key] !== 'object') appearance.icons[key]={};
       if(!appearance.icons[key].light || typeof appearance.icons[key].light !== 'object') appearance.icons[key].light={mode:'emoji',emoji:STORE_ICON_DEFAULTS[key]?.emoji||'',pngUrl:''};
       if(!appearance.icons[key].dark || typeof appearance.icons[key].dark !== 'object') appearance.icons[key].dark={mode:'emoji',emoji:STORE_ICON_DEFAULTS[key]?.emoji||'',pngUrl:''};
     };
     STORE_ICON_KEYS.forEach(ensureIconNode);
     for(const [key,k] of [['Dtf','dtf'],['Fabric','fabric'],['Delivery','delivery'],['Support','support'],['Cart','cart'],['Payment','payment'],['Facebook','facebook'],['Instagram','instagram'],['Tiktok','tiktok'],['Search','search'],['DeliveryHome','deliveryHome'],['DeliveryOffice','deliveryOffice']]){
       ensureIconNode(k);
       for(const modeName of ['Light','Dark']){
         const side=modeName==='Light'?'light':'dark';
         const mode=$('iconMode'+modeName+key)?.value==='png'?'png':'emoji';
         const emoji=($('icon'+modeName+key)?.value||STORE_ICON_DEFAULTS[k]?.emoji||'').trim();
         const file=$('iconPng'+modeName+key)?.files?.[0];
         let pngUrl=appearance.icons[k][side]?.pngUrl||'';
         if(file) pngUrl=await uploadAppearanceFile(file,'icon-'+k+'-'+side,{allowed:['image/png']});
         appearance.icons[k][side]={mode,emoji,pngUrl};
       }
     }
     ensureIconNode('theme');
     for(const modeName of ['Light','Dark']){
       const side=modeName==='Light'?'light':'dark';
       const mode=$('iconMode'+modeName+'Theme')?.value==='png'?'png':'emoji';
       const def=side==='light'?'🌙':'☀️';
       const emoji=($('icon'+modeName+'Theme')?.value||def).trim();
       const file=$('iconPng'+modeName+'Theme')?.files?.[0];
       let pngUrl=appearance.icons.theme[side]?.pngUrl||'';
       if(file) pngUrl=await uploadAppearanceFile(file,'icon-theme-'+side,{allowed:['image/png']});
       appearance.icons.theme[side]={mode,emoji,pngUrl};
     }
     // Keep legacy theme keys for older pages while the new light/dark structure is canonical.
     appearance.icons.themeLight=appearance.icons.theme.light;
     appearance.icons.themeDark=appearance.icons.theme.dark;
     appearance.deliveryTexts={
       title:(($('deliveryTextTitle')?.value ?? 'MODE DE LIVRAISON').trim()),
       homeTitle:(($('deliveryHomeTitle')?.value ?? 'Livraison à domicile').trim()),
       homeText:(($('deliveryHomeText')?.value ?? 'Votre adresse complète').trim()),
       officeTitle:(($('deliveryOfficeTitle')?.value ?? 'Livraison au bureau').trim()),
       officeText:(($('deliveryOfficeText')?.value ?? 'Point / bureau de livraison').trim())
     };
     const checkoutDefaults={title:'INFORMATIONS DE LIVRAISON',subtitle:'Choisissez le mode de livraison puis remplissez vos informations.',nameLabel:'Nom et prénom',namePlaceholder:'Ex: Mohamed Ali',phoneLabel:'Numéro de téléphone',phonePlaceholder:'05 / 06 / 07 XX XX XX XX',wilayaLabel:'Wilaya',wilayaPlaceholder:'Choisir',communeLabel:'Commune',communePlaceholder:'Choisir la commune',officeLabel:'Bureau / point de livraison',officePlaceholder:'Choisir le bureau',addressLabel:'Adresse complète',addressPlaceholder:'Cité, rue, numéro...',paymentTitle:'PAIEMENT',paymentMethod:'Paiement à la livraison',paymentDescription:'Vous payez à la réception de votre colis.',submitButton:'CONFIRMER LA COMMANDE',summaryTitle:'VOTRE COMMANDE',subtotalLabel:'Sous-total',shippingLabel:'Livraison',totalLabel:'Total'};
     appearance.checkoutTexts={};
     Object.keys(checkoutDefaults).forEach(k=>{const id='checkout'+k.charAt(0).toUpperCase()+k.slice(1);appearance.checkoutTexts[k]=String($(id)?.value ?? checkoutDefaults[k]).trim();});
     appearance.topbar={
       leftText:(($('topbarLeftText')?.value ?? '💳 Paiement à la livraison').trim()),
       rightText:(($('topbarRightText')?.value ?? '🚚 Livraison dans les 58 wilayas').trim()),
       leftAlign:['left','center','right'].includes($('topbarLeftAlign')?.value)?$('topbarLeftAlign').value:'left',
       rightAlign:['left','center','right'].includes($('topbarRightAlign')?.value)?$('topbarRightAlign').value:'right'
     };
     const normalizeSocialUrl=(value)=>{
       const v=String(value||'').trim();
       if(!v)return '';
       if(/^https?:\/\//i.test(v))return v;
       if(/^(javascript|data|vbscript):/i.test(v))return '';
       return 'https://'+v;
     };
     appearance.socialLinks={
       facebook:normalizeSocialUrl($('socialFacebookUrl')?.value),
       instagram:normalizeSocialUrl($('socialInstagramUrl')?.value),
       tiktok:normalizeSocialUrl($('socialTiktokUrl')?.value)
     };
     for(const input of document.querySelectorAll('[data-category-file]')){const file=input.files?.[0];const categoryId=input.dataset.categoryFile;if(file && categoryId){const c=categoryById(categoryId);if(c){c.imageUrl=await uploadAppearanceFile(file,'category-'+String(c.id).toLowerCase());}}}
     setCategoryList(getCategoryList());
     const {error}=await sb.client.from('store_settings').upsert({id:1,appearance}); if(error)throw error;
     $('appearanceMsg').className='success';$('appearanceMsg').textContent='Apparence enregistrée avec succès.'; await loadAppearance();
     document.querySelectorAll('#storeLogoLight,#storeLogoDark,#heroImageLight,#heroImageDark,#backgroundImageLight,#backgroundImageDark').forEach(x=>x.value='');
   }catch(err){$('appearanceMsg').className='error';$('appearanceMsg').textContent=err.message;}
 }
 const storeEditorKeys=['Dtf','Fabric','Delivery','Support','Cart','Payment','Facebook','Instagram','Tiktok','Search'];
 for(const key of storeEditorKeys.concat(['Theme'])){
   for(const modeName of ['Light','Dark']){
     const id='iconMode'+modeName+key;
     $(id)?.addEventListener('change',()=>{
       const isPng=$(id).value==='png';
       $('iconEmojiWrap'+modeName+key) && ($('iconEmojiWrap'+modeName+key).style.display=isPng?'none':'block');
       $('iconPngWrap'+modeName+key) && ($('iconPngWrap'+modeName+key).style.display=isPng?'block':'none');
     });
     $('iconPng'+modeName+key)?.addEventListener('change',()=>{
       const f=$('iconPng'+modeName+key).files[0], pv=$('iconPreview'+modeName+key); if(!f||!pv)return;
       const r=new FileReader(); r.onload=()=>{pv.innerHTML=`<img src="${r.result}" alt="">`;}; r.readAsDataURL(f);
     });
   }
 }
 for(let i=1;i<=3;i++){
   for(const mode of ['Light','Dark']){
     const key=mode+i;
     $('productServiceIconMode'+key)?.addEventListener('change',()=>{
       const isPng=$('productServiceIconMode'+key).value==='png';
       if($('productServiceIconPngWrap'+key))$('productServiceIconPngWrap'+key).style.display=isPng?'block':'none';
       if($('productServiceIconEmojiWrap'+key))$('productServiceIconEmojiWrap'+key).style.display=isPng?'none':'block';
     });
     $('productServiceIconPng'+key)?.addEventListener('change',()=>{
       const f=$('productServiceIconPng'+key).files[0],p=$('productServiceIconPreview'+key); if(f&&p)p.innerHTML=`<img src="${URL.createObjectURL(f)}" alt="">`;
     });
   }
 }
 for(let i=1;i<=4;i++){
   for(const mode of ['Light','Dark']){
     const key=mode+i;
     $('featureIconMode'+key)?.addEventListener('change',()=>{
       const isPng=$('featureIconMode'+key).value==='png';
       if($('featureIconPngWrap'+key))$('featureIconPngWrap'+key).style.display=isPng?'block':'none';
       if($('featureIconEmojiWrap'+key))$('featureIconEmojiWrap'+key).style.display=isPng?'none':'block';
     });
     $('featureIconPng'+key)?.addEventListener('change',()=>{
       const f=$('featureIconPng'+key).files[0], p=$('featureIconPreview'+key);
       if(f&&p){p.innerHTML=`<img src="${URL.createObjectURL(f)}" alt="">`;}
     });
   }
 }
 ['Dtf','Fabric','Delivery','Support','Cart','Payment','Facebook','Instagram','Tiktok','Search','DeliveryHome','DeliveryOffice','ThemeLight','ThemeDark'].forEach(k=>{
    $('iconMode'+k)?.addEventListener('change',()=>{
      const isPng=$('iconMode'+k).value==='png';
      if($('iconPngWrap'+k)) $('iconPngWrap'+k).style.display=isPng?'block':'none';
      if($('iconEmojiWrap'+k)) $('iconEmojiWrap'+k).style.display=isPng?'none':'block';
    });
    $('iconPng'+k)?.addEventListener('change',()=>{
      const f=$('iconPng'+k).files[0], p=$('iconPreview'+k);
      if(f && p){ const u=URL.createObjectURL(f); p.innerHTML=`<img src="${u}" alt="">`; }
    });
  });
  // Live preview for logo PNG uploads: the image immediately appears inside its fixed slot.
  [['storeLogoLight','logoLightPreview','mainLight'],['storeLogoDark','logoDarkPreview','mainDark']].forEach(([inputId,previewId,slot])=>{
    $(inputId)?.addEventListener('change',()=>{
      const f=$(inputId).files?.[0]; if(!f)return;
      if(String(f.type||'').toLowerCase()!=='image/png'){ $('appearanceMsg').className='error';$('appearanceMsg').textContent='Utilisez uniquement un fichier PNG transparent pour ce logo.'; return; }
      const u=URL.createObjectURL(f); const el=$(previewId); if(!el)return;
      const s=normalizeLogoSlots(appearance.logoSlots)[slot];
      el.innerHTML=`<img src="${u}" class="slot-image" alt="Logo" draggable="false">`;
      el.style.setProperty('--slot-x',`${s.x}px`);el.style.setProperty('--slot-y',`${s.y}px`);el.style.setProperty('--slot-scale',s.scale);
      bindLogoSlotControls();
    });
  });
  $('saveIntegrations')?.addEventListener('click',saveIntegrations);
  $('googleSheetsUrl')?.addEventListener('input',updateIntegrationStatus);
  $('metaPixelId')?.addEventListener('input',updateIntegrationStatus);
  document.querySelectorAll('[id$="Opacity"]').forEach(input=>{input.addEventListener('input',()=>{const out=$(input.id+'Value');if(out)out.textContent=input.value+'%';});});
  $('saveAppearance').onclick=saveAppearance;
 document.querySelectorAll('.appearance-lang-tab').forEach(b=>b.addEventListener('click',()=>{captureAppearanceLanguage(appearanceEditLang);applyAppearanceLanguageToPanel(b.dataset.appearanceLang);}));
 $('storeSmallFontSize')?.addEventListener('input',e=>setStoreFontSize('small',e.target.value)); $('storeLargeFontSize')?.addEventListener('input',e=>setStoreFontSize('large',e.target.value)); $('storeSmallFontMinus')?.addEventListener('click',()=>setStoreFontSize('small',(Number(appearance.storeFontSizes?.small)||100)-1)); $('storeSmallFontPlus')?.addEventListener('click',()=>setStoreFontSize('small',(Number(appearance.storeFontSizes?.small)||100)+1)); $('storeSmallFontReset')?.addEventListener('click',()=>setStoreFontSize('small',100)); $('storeLargeFontMinus')?.addEventListener('click',()=>setStoreFontSize('large',(Number(appearance.storeFontSizes?.large)||100)-1)); $('storeLargeFontPlus')?.addEventListener('click',()=>setStoreFontSize('large',(Number(appearance.storeFontSizes?.large)||100)+1)); $('storeLargeFontReset')?.addEventListener('click',()=>setStoreFontSize('large',100)); $('storeFontSizesSave')?.addEventListener('click',saveStoreFontSizes); $('navPositionX')?.addEventListener('input',e=>setNavPosition(e.target.value)); $('navPositionSave')?.addEventListener('click',saveNavPosition); $('navPositionMinus')?.addEventListener('click',()=>setNavPosition((Number(appearance.navPositionX)||0)-5)); $('navPositionPlus')?.addEventListener('click',()=>setNavPosition((Number(appearance.navPositionX)||0)+5)); $('navPositionReset')?.addEventListener('click',()=>setNavPosition(0)); $('storeTextsSave')?.addEventListener('click',saveStoreTexts); $('storeFontSave')?.addEventListener('click',saveStoreFont); $('storeFontDelete')?.addEventListener('click',deleteStoreFont); $('storeFontFile')?.addEventListener('change',e=>{const f=e.target.files?.[0];if(f){if(!f.name.toLowerCase().endsWith('.ttf')){e.target.value='';$('storeFontMsg').className='error';$('storeFontMsg').textContent='Utilisez uniquement un fichier .TTF.';return;} previewStoreFont(f);$('storeFontName').textContent='Fichier sélectionné : '+f.name;}}); $('storeTextsLoadDefaults')?.addEventListener('click',loadStoreTextsDefaults); $('storeTextsSearch')?.addEventListener('input',renderStoreTextsEditor); $('storeTextsCategory')?.addEventListener('change',renderStoreTextsEditor); if($('addSizeGuide'))$('addSizeGuide').onclick=()=>{appearance.sizeGuides=getSizeGuides();appearance.sizeGuides.push({id:`guide-${Date.now()}`,name:`Guide ${appearance.sizeGuides.length+1}`,active:true,tricotName:'TRICOT',pantalonName:'PANTALON',tricot:[['S','',''],['M','',''],['L','',''],['XL','','']],pantalon:[]});renderSizeGuidesPanel();renderProductSizeGuideSelect();};
 $('savePages')?.addEventListener('click',savePages);
 $('featuresBarOpacityLight')?.addEventListener('input',e=>{if($('featuresBarOpacityLightValue'))$('featuresBarOpacityLightValue').textContent=e.target.value+'%';});
 $('featuresBarOpacityDark')?.addEventListener('input',e=>{if($('featuresBarOpacityDarkValue'))$('featuresBarOpacityDarkValue').textContent=e.target.value+'%';});
 $('deleteLogoLight').onclick=async()=>{appearance.logoLightUrl='';appearance.logoSlots=normalizeLogoSlots(appearance.logoSlots);appearance.logoSlots.mainLight={...DEFAULT_LOGO_SLOTS.mainLight};refreshAppearancePreviews();await saveAppearance();};
 $('deleteLogoDark').onclick=async()=>{appearance.logoDarkUrl='';appearance.logoSlots=normalizeLogoSlots(appearance.logoSlots);appearance.logoSlots.mainDark={...DEFAULT_LOGO_SLOTS.mainDark};refreshAppearancePreviews();await saveAppearance();};
 $('deleteHeroLight').onclick=async()=>{appearance.heroLightUrl='';refreshAppearancePreviews();await saveAppearance();};
 $('deleteHeroDark').onclick=async()=>{appearance.heroDarkUrl='';refreshAppearancePreviews();await saveAppearance();};
 $('deleteBackgroundLight').onclick=async()=>{appearance.backgroundLightUrl='assets/background-light.png';refreshAppearancePreviews();await saveAppearance();};
 $('deleteBackgroundDark').onclick=async()=>{appearance.backgroundDarkUrl='assets/background-noir.png';refreshAppearancePreviews();await saveAppearance();};
 $('resetAppearance').onclick=async()=>{if(confirm('Réinitialiser les images personnalisées ?')){appearance={...appearance,logoLightUrl:'',logoDarkUrl:'',logoSlots:normalizeLogoSlots(),heroLightUrl:'',heroDarkUrl:'',backgroundLightUrl:'assets/background-light.png',backgroundDarkUrl:'assets/background-noir.png',logoUrl:'',heroUrl:'',categories:{},icons:{dtf:{mode:'emoji',emoji:'▣',pngUrl:''},fabric:{mode:'emoji',emoji:'♢',pngUrl:''},delivery:{mode:'emoji',emoji:'▱',pngUrl:''},support:{mode:'emoji',emoji:'◌',pngUrl:''},cart:{mode:'emoji',emoji:'🛒',pngUrl:''},payment:{mode:'emoji',emoji:'💳',pngUrl:''},facebook:{mode:'emoji',emoji:'f',pngUrl:''},instagram:{mode:'emoji',emoji:'◎',pngUrl:''},tiktok:{mode:'emoji',emoji:'♪',pngUrl:''},search:{mode:'emoji',emoji:'🔍',pngUrl:''},deliveryHome:{mode:'emoji',emoji:'🏠',pngUrl:''},deliveryOffice:{mode:'emoji',emoji:'🏢',pngUrl:''},theme:{mode:'emoji',emoji:'☀️',pngUrl:''},themeLight:{mode:'emoji',emoji:'🌙',pngUrl:''},themeDark:{mode:'emoji',emoji:'☀️',pngUrl:''}},deliveryTexts:{title:'MODE DE LIVRAISON',homeTitle:'Livraison à domicile',homeText:'Votre adresse complète',officeTitle:'Livraison au bureau',officeText:'Point / bureau de livraison'},homeFeaturesBar:{light:{background:'#ffffff',opacity:.06},dark:{background:'#ffffff',opacity:.05}},cardStyles:{productInfo:{light:{background:'#ffffff',opacity:.06},dark:{background:'#ffffff',opacity:.05}},productServices:{light:{background:'#ffffff',opacity:.05},dark:{background:'#ffffff',opacity:.04}},checkoutSteps:{light:{background:'#ffffff',opacity:.05},dark:{background:'#ffffff',opacity:.04}},cartReview:{light:{background:'#ffffff',opacity:.05},dark:{background:'#ffffff',opacity:.04}},cartItem:{light:{background:'#ffffff',opacity:.04},dark:{background:'#ffffff',opacity:.035}},deliveryInfo:{light:{background:'#ffffff',opacity:.06},dark:{background:'#ffffff',opacity:.05}},deliveryMode:{light:{background:'#ffffff',opacity:.04},dark:{background:'#ffffff',opacity:.035}},payment:{light:{background:'#ffffff',opacity:.04},dark:{background:'#ffffff',opacity:.035}},summary:{light:{background:'#ffffff',opacity:.06},dark:{background:'#ffffff',opacity:.05}}},siteBars:{topbar:{light:{background:'#f5f5f5',opacity:1},dark:{background:'#101010',opacity:1}},header:{light:{background:'#f5f5f5',opacity:1},dark:{background:'#101010',opacity:1}},footer:{light:{background:'#f5f5f5',opacity:1},dark:{background:'#101010',opacity:1}}},homeFeatures:[{title:'IMPRESSION DTF',text:'Haute qualité',iconLight:{mode:'emoji',emoji:'▣',pngUrl:''},iconDark:{mode:'emoji',emoji:'▣',pngUrl:''}},{title:'TISSUS PREMIUM',text:'Confort garanti',iconLight:{mode:'emoji',emoji:'♢',pngUrl:''},iconDark:{mode:'emoji',emoji:'♢',pngUrl:''}},{title:'LIVRAISON 58 WILAYAS',text:'Paiement à la livraison',iconLight:{mode:'emoji',emoji:'▱',pngUrl:''},iconDark:{mode:'emoji',emoji:'▱',pngUrl:''}},{title:'SERVICE CLIENT 7/7',text:'Nous sommes là pour vous',iconLight:{mode:'emoji',emoji:'◌',pngUrl:''},iconDark:{mode:'emoji',emoji:'◌',pngUrl:''}}],productServices:[{title:'58 wilayas',text:'Livraison',iconLight:{mode:'emoji',emoji:'🚚',pngUrl:''},iconDark:{mode:'emoji',emoji:'🚚',pngUrl:''}},{title:'À la livraison',text:'Paiement',iconLight:{mode:'emoji',emoji:'💳',pngUrl:''},iconDark:{mode:'emoji',emoji:'💳',pngUrl:''}},{title:'DTF Premium',text:'Qualité',iconLight:{mode:'emoji',emoji:'✓',pngUrl:''},iconDark:{mode:'emoji',emoji:'✓',pngUrl:''}}]};refreshAppearancePreviews();await saveAppearance();}};

  document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>showTab(b.dataset.tab));$('refreshOrders').onclick=()=>location.reload();$('ordersDate').value=todayKey();$('ordersDate').onchange=renderOrders;$('ordersPrevDay').onclick=()=>shiftOrdersDay(-1);$('ordersNextDay').onclick=()=>shiftOrdersDay(1);$('ordersToday').onclick=()=>{$('ordersDate').value=todayKey();renderOrders();};$('ordersStatusFilter').onchange=renderOrders;$('exportOrdersExcel').onclick=exportOrdersExcel;
 $('logout').onclick=async()=>{await sb.client.auth.signOut();location.href='login.html';};
 document.addEventListener('DOMContentLoaded',async()=>{if(await requireAdmin()){await loadProducts();await loadOrders();await loadDashboardStats();}});
})();
