<template>
  <div>
    <template v-if="regions.length > 0">
      <textarea id="mhw_regions" :value="JSON.stringify(regions)" rows="5" cols="100"></textarea>
      <button @click="copyToClipboard('mhw_regions')">
        Copy
      </button>
      <br />
    </template>
    <template v-if="material.length > 0">
      <textarea id="mhw_material" :value="JSON.stringify(material)" rows="5" cols="100"></textarea>
      <button @click="copyToClipboard('mhw_material')">
        Copy
      </button>
    </template>
    <template v-if="page_url == '/Large+Monsters'">
      <textarea id="mhw_material" :value="JSON.stringify(monster)" rows="5" cols="100"></textarea>
      <button @click="getMonsters">
        GetData
      </button>
      <button @click="copyToClipboard('mhw_material')">
        Copy
      </button>
    </template>
  </div>
</template>
<script>
export default {
  name: 'getData',
  data() {
    return {
      data: {
        name: '',
        description: '',
        tempered: false,
        monsters: [],
      },
      page: null,
      page_url: null,
      regions: [],
      material: [],
      monster: [],
    };
  },
  mounted() {
    this.checkPage();
    this.parsePage();
  },
  methods: {
    checkPage() {
      this.page_url = window.location.pathname;
    },
    parsePage() {
      switch (this.page_url) {
        case '/Guiding+Lands':
          this.getGuidingLands();
          break;
        case '/Large+Monsters':
          this.getMonsters();
          break;
      }
    },
    getGuidingLands() {
      const tabs = document.querySelectorAll('p.special');
      if (tabs.length > 0) {
        // every regions tab
        for (let tab of tabs) {
          // set region name
          const regionName = 'Guiding Lands: ' + tab.innerText.substring(0, tab.innerText.indexOf('Region') - 1);
          let levels = tab.nextElementSibling.getElementsByTagName('tr');
          let output = {};
          let currentLevel = null;
          // every regions level
          for (let row of levels) {
            // if level row
            if (row.innerText.includes('Level')) {
              currentLevel = row.innerText.substring(row.innerText.indexOf('Level') + 6, row.innerText.indexOf('Level') + 7);
            } else {
              // if monster row
              const data = row.querySelectorAll('td');
              if (data.length == 2) {
                let tempered = '';
                // check if tempered monster
                if (data[0].innerHTML.includes('color: #cc99ff')) {
                  tempered = 'Tempered ';
                }
                const t = data[0].innerText;
                // get monster data
                let m = {
                  name: tempered + t.substring(0, t.indexOf('(') - 1).trim(),
                  rate: t.substring(t.indexOf('(') + 1, t.indexOf(')')).length,
                };
                // set monster data
                if (!output[m.name]) {
                  output[m.name] = { level: {}, material: [] };
                }
                if (!output[m.name].level[currentLevel]) {
                  output[m.name].level[currentLevel] = {};
                }
                // set monster rates for level
                output[m.name].level[currentLevel].rate = m.rate;

                // get material for monsters & rating
                const mats = data[1].querySelectorAll('a.wiki_link');
                if (mats.length > 0) {
                  for (let mat of mats) {
                    let name = mat.innerText.trim();
                    if (name.includes('(')) name = name.substring(0, name.indexOf('(')).trim();
                    let rate = null;
                    // check for rating
                    if (mat.nextSibling && mat.nextSibling.length > 3 && mat.nextSibling.length <= 8) {
                      rate = mat.nextSibling.length - 3;
                    }
                    // check if material is already known
                    if (!output[m.name].material.find(x => x.name == mat.innerText)) {
                      output[m.name].material.push({ name, rate });
                    }

                    // set material.json
                    if (!this.material.find(x => x.name == name)) {
                      this.material.push({ name, source: { monster: [] } });
                    }
                    let materialObj = this.material.find(x => x.name == name);
                    if (materialObj) {
                      let monsterObj = materialObj.source.monster.find(x => x.name == m.name);
                      if (!monsterObj) {
                        materialObj.source.monster.push({ name: m.name, tempered: tempered == '' ? false : true, location: [] });
                        monsterObj = materialObj.source.monster.find(x => x.name == m.name);
                      }
                      let regionObj = monsterObj.location.find(x => x.name == regionName);
                      if (!regionObj) {
                        monsterObj.location.push({ name: regionName, level: [] });
                        regionObj = monsterObj.location.find(x => x.name == regionName);
                      }
                      regionObj.level.push(currentLevel);
                    }
                  }
                }
              }
            }
          }
          this.regions.push({ name: regionName, data: output });
        }
      }
    },
    getMonsters() {
      this.monster = [];
      console.log('getting monsters');
      const nodeList = document.querySelectorAll('h4');
      for (let mon of nodeList) {
        const img = mon.getElementsByTagName('img');
        if (img.length > 0) {
          for (let image of img) {
            let new_monster = {
              name: null,
              icon: null,
              url: null,
            };
            // set icon
            new_monster.icon = image.src;
            // set url
            new_monster.url = image.closest('a') ? image.closest('a').href : null;
            // set name
            new_monster.name = image.closest('a') ? image.closest('a').innerText.trim() : null;

            // fix for old monsters
            if (!new_monster.name) {
              const fallback = mon.querySelectorAll('a.wiki_link ');
              console.log(fallback);
              if (fallback.length > 0) {
                new_monster.name = fallback[0].innerText.trim();
                new_monster.url = fallback[0].href;
              }
            }
            this.monster.push(new_monster);
          }
        }
      }
    },
    copyToClipboard(id) {
      const el = document.getElementById(id);
      el.select();
      document.execCommand('copy');
    },
  },
};
</script>
