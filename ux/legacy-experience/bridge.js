(function () {
  'use strict';
  let context;
  const api=window.PRXLegacyApi;
  function emit() {
    if(!context||!api)return;
    const values=api.resolveAll().values;
    const palette=window.NGDesign.palette(values.themeColor);
    parent.postMessage({type:'prx.experience.preview',workspace:context.workspace,nonce:context.nonce,
      config:{theme:api.state.theme,color:palette.accent,locale:api.state.uiLocale==='en'?'en':'zh-TW',
        label:context.label,legacy:{objects:api.clone(api.state.draft)}}},location.origin);
  }
  window.addEventListener('message',event=>{
    if(event.source!==parent||event.origin!==location.origin)return;
    const x=event.data;
    if(!x||x.type!=='prx.experience.context'||typeof x.workspace!=='string'||typeof x.nonce!=='string'||typeof x.label!=='string'||!api)return;
    context=x;
    const config=x.config;
    if(config&&['NG','PH','IN','SF'].includes(config.theme)) {
      api.state.theme=config.theme;
      if(config.legacy&&config.legacy.objects&&typeof config.legacy.objects==='object') {
        api.state.draft=api.clone(config.legacy.objects);
        api.state.published.objects=api.clone(config.legacy.objects);
      }
      api.state.published.theme=config.theme;
      api.state.uiLocale=config.locale==='en'?'en':'zh';
      api.state.tenantId='prx:'+x.workspace;
      api.state.expectedVersion=api.state.published.version;
      api.renderAll();
    }
    emit();
  });
  window.addEventListener('prx-legacy-change',emit);
  document.addEventListener('click',e=>{if(e.target.closest('a[href^="http"]'))e.preventDefault();},true);
  parent.postMessage({type:'prx.experience.ready'},location.origin);
})();
