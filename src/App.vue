<template>
  <p>{{ greeting }} World!</p>
</template>

<script>
import { head } from 'lodash'
import $ from 'jquery'

export default {
  data: () => ({
    greeting: 'Hello'
  }),
  created () {
    // use vendor libs

    const v = head([1, 2, 3])
    console.log(v)

    const id = $('#app').attr('id')
    console.log(id)
  }
}
</script>

<style scoped>
p {
  font-size: 2em;
  text-align: center;
}
</style>
