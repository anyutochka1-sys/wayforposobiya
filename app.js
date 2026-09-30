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
    title:'Беременность',
    text:'Проверьте выплаты, которые доступны во время беременности.',
    tags:['беременность'], source:sources.pregnancy
  },
  bir: {
    icon:'▤', color:'#8f4f53', phase:'Во время беременности',
    title:'Пособие по беременности и родам',
    text:'Проверьте выплаты, связанные с декретом и рождением малыша.',
    tags:['декрет'], source:sources.bir
  },
  birth: {
    icon:'♡', color:'#d3a64f', phase:'После рождения',
    title:'Рождение ребёнка',
    text:'После рождения появляются новые выплаты и меры поддержки.',
    tags:['рождение'], source:sources.birth
  },
  matkap: {
    icon:'⌂', color:'#8aa08c', phase:'После рождения / усыновления',
    title:'Материнский капитал',
    text:'На этом этапе стоит проверить материнский капитал и варианты его использования.',
    tags:['маткапитал'], source:sources.matkap
  },
  care: {
    icon:'◉', color:'#5f8f8a', phase:'До 1,5 лет',
    title:'Ребёнку до 1,5 лет',
    text:'Проверьте выплаты, которые действуют в первые полтора года жизни ребёнка.',
    tags:['до 1,5 лет'], source:sources.care
  },
  unified: {
    icon:'₽', color:'#a56f55', phase:'С рождения до 17 лет',
    title:'Единое пособие на ребёнка',
    text:'На всём пути до 17 лет стоит периодически проверять право на единое пособие.',
    tags:['0–17 лет'], source:sources.unified
  },
  age15to3: {
    icon:'●', color:'#c98c6f', phase:'1,5–3 года',
    title:'Ребёнку от 1,5 до 3 лет',
    text:'После 1,5 лет набор доступных выплат меняется. Проверьте, что остаётся актуальным до трёх лет.',
    tags:['1,5–3 года'], source:sources.matkap
  },
  preschool: {
    icon:'▦', color:'#8d9c72', phase:'Дошкольный возраст',
    title:'Ребёнку от 3 до 7 лет',
    text:'Проверьте меры поддержки для дошкольников и выплаты вашего региона.',
    tags:['3–7 лет','регион'], source:'https://anyutochka1-sys.github.io/regions/'
  },
  familyTax: {
    icon:'₽', color:'#a66a52', phase:'С 2026 года · ежегодно',
    title:'Ежегодная семейная выплата работающим родителям',
    text:'Если детей двое и больше, проверьте дополнительные семейные меры поддержки.',
    tags:['2+ детей'], source:'https://sfr.gov.ru/order/families/'
  },
  special: {
    icon:'!', color:'#b97965', phase:'Проверьте особые обстоятельства',
    title:'Дополнительные федеральные выплаты могут зависеть не от возраста',
    text:'Если у семьи есть особая ситуация, могут быть дополнительные выплаты вне обычной возрастной лесенки.',
    tags:['особые случаи'], source:'https://sfr.gov.ru/grazhdanam/semyam_s_detmi/'
  },
  school: {
    icon:'▱', color:'#6f8797', phase:'Школьный возраст',
    title:'Ребёнку от 7 до 17 лет',
    text:'Проверьте меры поддержки для школьников и региональные льготы.',
    tags:['7–17 лет','регион'], source:'https://anyutochka1-sys.github.io/regions/'
  },
  multi: {
    icon:'✦', color:'#956b84', phase:'Если детей трое и больше',
    title:'Меры для многодетной семьи',
    text:'Для семей с тремя и более детьми есть отдельные федеральные и региональные меры.',
    tags:['3+ детей'], source:'https://anyutochka1-sys.github.io/regions/'
  },
  finish: {
    icon:'→', color:'#7d817e', phase:'Дальше',
    title:'Сохраните маршрут и проверяйте изменения',
    text:'По мере взросления ребёнка возвращайтесь к маршруту и смотрите следующий этап.',
    tags:['следующий этап'], source:'https://sfr.gov.ru/grazhdanam/semyam_s_detmi/'
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
  if(current){
    const card=node.querySelector('.stage-card');
    card.classList.add('current');
    const meta=node.querySelector('.stage-meta');
    meta.innerHTML='<span class="you-are-here">Вы здесь</span> ' + meta.textContent;
  }
  timeline.appendChild(node);
}
function buildRoute({pregnant,count,ages}){
  const youngest = ages.length ? Math.min(...ages) : null;
  const route=[];

  if(pregnant){
    route.push(['pregnancy',true],['birth',false],['care',false],['age15to3',false],['preschool',false],['school',false]);
  } else if(count===0){
    route.push(['finish',true]);
  } else if(youngest < .5){
    route.push(['birth',true],['care',false],['age15to3',false],['preschool',false],['school',false]);
  } else if(youngest < 1.5){
    route.push(['care',true],['age15to3',false],['preschool',false],['school',false]);
  } else if(youngest < 3){
    route.push(['age15to3',true],['preschool',false],['school',false]);
  } else if(youngest < 7){
    route.push(['preschool',true],['school',false]);
  } else if(youngest < 17){
    route.push(['school',true]);
  } else {
    route.push(['finish',true]);
  }

  return route;
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
    resultIntro.textContent=`Ваш путь начинается с беременности. Ниже — основные этапы, по которым удобно проверять поддержку семьи.`;
  } else if(count){
    const y=ages.length?Math.min(...ages):0;
    resultIntro.textContent=count>1
      ? `Начинаем с этапа младшего ребёнка. Возраст старших детей тоже сохраните в виду: у них могут быть свои актуальные меры.`
      : `Начинаем с текущего этапа ребёнка и идём дальше по возрасту.`;
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

