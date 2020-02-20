<template>
  <div>
    <!-- {
    <br />id: ?,
    <br />
    name: '{{ data.name }}',
    <br />
    description: '{{ data.description }}',
    <br />source: {
    <br />monster: {
    <br />
    <span v-if="data.monsters.length>0">
      <span v-for="mon in data.monsters" :key="mon.name">
        {
        <br />
        {{mon.name}}:{
        <br />
        rate: {{mon.rate}},
        <span v-if="data.tempered">
          <br />tempered: true,
        </span>
        <br />
        location: {
        }
        <br />},
      </span>
    </span>
    }
    <br />} -->
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
      search: ['/Guiding+Lands'],
      page: null,
      page_url: null,
      regions: [],
      material: [],
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
          //this.getMaterial();
          break;
      }
    },
    getGuidingLands() {
      console.log(document.querySelectorAll('p.special'));
      const tabs = document.querySelectorAll('p.special');
      if (tabs.length > 0) {
        // every regions tab
        for (let tab of tabs) {
          // set region name
          const name = 'Guiding Lands: ' + tab.innerText.substring(0, tab.innerText.indexOf('Region') - 1);
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
                  output[m.name] = {};
                }
                if (!output[m.name][currentLevel]) {
                  output[m.name][currentLevel] = {};
                }
                output[m.name][currentLevel].rate = m.rate;
                console.log('monster:', m);
              }
            }
          }
          console.log(output);
          this.regions.push({ name, data: output });
        }
      }
    },
    getMaterial() {
      return;
      const s = {
        title_id: 'page-title',
        content: 'wiki-content-block',
      };
      // name
      const title = document.getElementById(s.title_id);
      if (title && title.innerText) {
        this.data.name = title.innerText.split(' - ')[0];
      }
      //description
      const content = document.getElementById(s.content);
      if (content) {
        const desc = content.getElementsByTagName('blockquote');
        if (desc.length > 0) {
          this.data.description = desc[0].innerText;
        }
        if (this.data.description.includes('tempered')) {
          this.data.tempered = true;
        }
      }
      //monsters
      let monsters = document.querySelectorAll("a.wiki_link[href='/Monsters']");

      if (monsters && monsters[0]) {
        monsters = monsters[0].closest('div');
        if (monsters) {
          const found = monsters.getElementsByTagName('li');
          for (let mon of found) {
            console.log(mon.innerText);
            console.log(mon.innerText.indexOf('('));
            const name = mon.innerText.substring(0, mon.innerText.indexOf('(') - 1);
            console.log(name);
            const rate = mon.innerText.indexOf(')') - mon.innerText.indexOf('(') - 1;
            this.data.monsters.push({
              name,
              rate,
            });
          }
        }
      }
    },
  },
};
</script>
