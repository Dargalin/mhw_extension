<template>
  <div>
    {
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
    <br />}
  </div>
</template>
<script>
export default {
  name: 'getMaterial',
  data() {
    return {
      data: {
        name: '',
        description: '',
        tempered: false,
        monsters: [],
      },
      search: ['Materials'],
      breadcrumbs: {
        id: 'breadcrumbs-container',
        text: null,
      },
      page: null,
    };
  },
  mounted() {
    this.checkPage();
    this.parsePage();
  },
  methods: {
    checkPage() {
      const element = document.getElementById(this.breadcrumbs.id);
      if (element) {
        this.breadcrumbs.text = element.innerText;
        for (let i = 0; i < this.search.length; i++) {
          if (this.breadcrumbs.text.includes(this.search[i])) {
            this.page = this.search[i];
            break;
          }
        }
      }
    },
    parsePage() {
      switch (this.page) {
        case 'Materials':
          this.getMaterial();
          break;
      }
    },
    getMaterial() {
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
