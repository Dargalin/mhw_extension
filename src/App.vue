<template>
  <div id="mhw_debug">
    <template v-if="debug">
      <GetData />
    </template>
    <Fextralife :monster="monster" :material="material" :location="location" />
  </div>
</template>

<script>
import Monster from './data/monster.json';
import Location from './data/location.json';
import Material from './data/material_new.json';
import Fextralife from './content_scripts/Fextralife.vue';
import GetData from './content_scripts/GetData.vue';

export default {
  name: 'MHWreplace',
  components: {
    Fextralife,
    GetData,
  },
  data() {
    return {
      debug: true,
      monster: Monster,
      location: Location,
      material: Material,
    };
  },
};
</script>

<style lang="scss" scoped>
#mhw_debug {
  position: fixed;
  background: white;
  color: #333;
  font-size: 12px;
  padding: 0.5em;
  top: 1em;
  right: 1em;
  z-index: 100000;
  max-height: 50vh;
  overflow-y: auto;
}
</style>
