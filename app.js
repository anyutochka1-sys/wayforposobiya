const form = document.getElementById('familyForm');
const countSelect = document.getElementById('childrenCount');
const agesWrap = document.getElementById('childrenAges');
const result = document.getElementById('result');
const timeline = document.getElementById('timeline');
const resultIntro = document.getElementById('resultIntro');
const template = document.getElementById('stageTemplate');

const sources = {
  pregnancy: 'https://sfr.gov.ru/grazhdanam/semyam_s_detmi/edinoe_posobie/',
  bir: 'https://sfr.gov.ru/grazhdanam/semyam_s_detmi/posobie_po_beremennosti_i_rodam/',
  birth: 'https://sfr.gov.ru/grazhdanam/semyam_s_detmi/edinovremennoe_posobie_pri_rozhdenii_rebenka/',
  care: 'https://sfr.gov.ru/grazhdanam/semyam_s_detmi/ezhemesyachnoe_posobie_po_uhodu_za_rebenkom/',
  unified: 'https://sfr.gov.ru/grazhdanam/semyam_s_detmi/edinoe_posobie/',
  matkap: 'https://sfr.gov.ru/grazhdanam/semyam_s_detmi/materinskij_kapital/',
  matkapAmount: 'https://sfr.gov.ru/grazhdanam/semyam_s_detmi/materinskij_kapital/razmer'
};

const stages = {
  pregnancy: {
    icon:'◒', color:'#bd684f', phase:'Сейчас · беременность',
    title:'Единое пособие беременной',
    text:'Стоит проверить, если вы встали на учёт в ранние сроки и семья проходит условия по доходам, имуществу и другим критериям.',
    tags:['беременность','по условиям'], source:sources.pregnancy
  },
  bir: {
    icon:'▤', color:'#8f4f53', phase:'Во время беременности',
    title:'Пособие по беременности и родам',
    text:'Для женщин, у которых есть право на БиР по закону. Для работающих размер обычно зависит от среднего заработка и длительности отпуска.',
    tags:['БиР','до родов и после родов'], source:sources.bir
  },
  birth: {
    icon:'♡', color:'#d3a64f', phase:'После рождения',
    title:'Единовременное пособие при рождении ребёнка',
    text:'Разовая федеральная выплата одному из родителей. При рождении двух и более детей выплата назначается на каждого ребёнка.',
    tags:['разовая выплата','на каждого новорождённого'], source:sources.birth
  },
  matkap: {
    icon:'⌂', color:'#8aa08c', phase:'После рождения / усыновления',
    title:'Материнский капитал',
    text:'Проверьте право на сертификат и возможный размер. В большинстве случаев СФР оформляет сертификат проактивно.',
    tags:['федеральная мера','сертификат'], source:sources.matkap
  },
  care: {
    icon:'◉', color:'#5f8f8a', phase:'До 1,5 лет',
    title:'Пособие по уходу за ребёнком до 1,5 лет',
    text:'Для работающих и отдельных категорий неработающих. У работающих выплата связана со средним заработком; условия для неработающих отличаются.',
    tags:['ежемесячно','до 1,5 лет'], source:sources.care
  },
  unified: {
    icon:'₽', color:'#a56f55', phase:'С рождения до 17 лет',
    title:'Единое пособие на ребёнка',
    text:'Его стоит проверять на каждом возрастном этапе до 17 лет, если среднедушевой доход семьи ниже регионального прожиточного минимума и выполнены остальные условия.',
    tags:['0–17 лет','доход и имущество'], source:sources.unified
  },
  age15to3: {
    icon:'●', color:'#c98c6f', phase:'1,5–3 года',
    title:'Проверка выплат после 1,5 лет',
    text:'Федеральное пособие по уходу заканчивается в 1,5 года, но единое пособие может продолжаться. Также проверьте выплату из маткапитала до 3 лет, если подходите по условиям.',
    tags:['1,5–3 года','проверить маткапитал'], source:sources.matkap
  },
  preschool: {
    icon:'▦', color:'#8d9c72', phase:'Дошкольный возраст',
    title:'Детский сад и региональная поддержка',
    text:'На этом этапе особенно важны региональные правила: компенсация родительской платы, льготы многодетным, питание и другие меры различаются по субъектам РФ.',
    tags:['детский сад','региональные меры'], source:'https://anyutochka1-sys.github.io/regions/'
  },
  school: {
    icon:'▱', color:'#6f8797', phase:'Школьный возраст',
    title:'Школьные и региональные меры',
    text:'Универсальной федеральной «школьной выплаты» на каждый год нет. Проверяйте региональные выплаты, питание, форму, проезд и льготы для вашей категории семьи.',
    tags:['школа','региональные меры'], source:'https://anyutochka1-sys.github.io/regions/'
  },
  multi: {
    icon:'✦', color:'#956b84', phase:'Если детей трое и больше',
    title:'Меры для многодетной семьи',
    text:'Проверьте федеральные и региональные льготы многодетным. Конкретный набор зависит от состава семьи, региона и других условий.',
    tags:['3+ детей','отдельная проверка'], source:'https://anyutochka1-sys.github.io/regions/'
  },
  finish: {
    icon:'→', color:'#7d817e', phase:'Дальше',
    title:'Сохраните маршрут и проверяйте изменения',
    text:'Правила и суммы меняются. Перед подачей заявления сверяйте условия на официальном сайте СФР, Госуслугах или в уполномоченном органе вашего региона.',
    tags:['проверка перед подачей'], source:'https://sfr.gov.ru/grazhdanam/semyam_s_detmi/'
  }
};

function renderAgeFields(){
  const count = Number(countSelect.value);
  agesWrap.innerHTML = '';
  for(let i=0;i<count;i++){
    const box=document.createElement('div');
    box.className='age-field';
    box.innerHTML = `
      <label>Возраст ${i+1}-го ребёнка</label>
      <div class="age-row">
        <select class="age-years" aria-label="Полных лет ребёнка ${i+1}">
          ${Array.from({length:18},(_,n)=>`<option value="${n}">${n} ${yearWord(n)}</option>`).join('')}
          <option value="18">18+ лет</option>
        </select>
        <select class="age-months" aria-label="Месяцев сверх полных лет ребёнка ${i+1}">
          ${Array.from({length:12},(_,n)=>`<option value="${n}">${n} мес.</option>`).join('')}
        </select>
      </div>`;
    agesWrap.appendChild(box);
  }
}
function yearWord(n){
  if(n===0) return 'лет';
  if(n%10===1 && n%100!==11) return 'год';
  if([2,3,4].includes(n%10) && ![12,13,14].includes(n%100)) return 'года';
  return 'лет';
}
function getChildrenAges(){
  return [...document.querySelectorAll('.age-field')].map(box=>{
    const years=Number(box.querySelector('.age-years').value);
    const months=Number(box.querySelector('.age-months').value);
    return years>=18 ? 18 : years + months/12;
  });
}
function addStage(key,current=false){
  const data=stages[key];
  const node=template.content.firstElementChild.cloneNode(true);
  node.style.setProperty('--stage-color',data.color);
  node.querySelector('.stage-icon').textContent=data.icon;
  node.querySelector('.stage-meta').textContent=data.phase;
  node.querySelector('h3').textContent=data.title;
  node.querySelector('.stage-text').textContent=data.text;
  node.querySelector('.stage-tags').innerHTML=data.tags.map(t=>`<span>${t}</span>`).join('');
  const link=node.querySelector('.stage-link');
  link.href=data.source;
  if(current) node.querySelector('.stage-card').classList.add('current');
  timeline.appendChild(node);
}
function buildRoute({pregnant,count,ages}){
  const futureChildren = count + (pregnant ? 1 : 0);
  const under17 = ages.filter(a=>a<17);
  const youngest = ages.length ? Math.min(...ages) : null;
  const route=[];

  if(pregnant){
    route.push(['pregnancy',true],['bir',false],['birth',false],['matkap',false],['care',false],['unified',false],['age15to3',false],['preschool',false],['school',false]);
  } else if(count===0){
    route.push(['finish',true]);
  } else {
    if(youngest < .5){ route.push(['birth',true],['matkap',false],['care',false],['unified',false],['age15to3',false],['preschool',false],['school',false]); }
    else if(youngest < 1.5){ route.push(['care',true],['unified',false],['age15to3',false],['preschool',false],['school',false]); }
    else if(youngest < 3){ route.push(['age15to3',true],['unified',false],['preschool',false],['school',false]); }
    else if(youngest < 7){ route.push(['preschool',true],['unified',false],['school',false]); }
    else if(youngest < 17){ route.push(['school',true],['unified',false]); }
    else { route.push(['finish',true]); }
  }
  if(futureChildren>=3){
    const insertAt = Math.min(route.length, pregnant ? 4 : 1);
    route.splice(insertAt,0,['multi',false]);
  }
  if(under17.length && !route.some(([k])=>k==='unified')) route.push(['unified',false]);
  route.push(['finish',false]);
  return route.filter((item,i,arr)=>arr.findIndex(x=>x[0]===item[0])===i);
}

countSelect.addEventListener('change',renderAgeFields);
renderAgeFields();

form.addEventListener('submit',e=>{
  e.preventDefault();
  const pregnant=form.elements.pregnant.value==='yes';
  const count=Number(countSelect.value);
  const ages=getChildrenAges();
  timeline.innerHTML='';
  const route=buildRoute({pregnant,count,ages});
  route.forEach(([key,current])=>addStage(key,current));

  const totalAfterBirth=count+(pregnant?1:0);
  if(pregnant){
    resultIntro.textContent=`Начинаем с беременности. После рождения в семье будет ${totalAfterBirth} ${childWord(totalAfterBirth)}. Ниже — последовательность мер, которые стоит проверять по мере движения по возрасту.`;
  } else if(count){
    const y=ages.length?Math.min(...ages):0;
    resultIntro.textContent=`Маршрут начинается с текущего возраста младшего ребёнка. В семье ${count} ${childWord(count)}; отдельные меры могут зависеть и от возраста старших детей.`;
  } else {
    resultIntro.textContent='Сейчас детей нет и беременность не отмечена. Когда этап изменится, вернитесь и перестройте маршрут.';
  }
  result.classList.remove('hidden');
  result.scrollIntoView({behavior:'smooth',block:'start'});
});

function childWord(n){
  if(n%10===1 && n%100!==11) return 'ребёнок';
  if([2,3,4].includes(n%10) && ![12,13,14].includes(n%100)) return 'ребёнка';
  return 'детей';
}

document.querySelectorAll('.js-consult').forEach(btn=>btn.addEventListener('click',()=>{
  alert('Ссылка на запись на консультацию пока не подключена. Здесь будет прямой переход к Анне.');
}));
