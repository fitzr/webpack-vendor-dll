<template>
<div class='container'>
  <p>{{ greeting }} World!</p>
</div>
</template>

<script>
import { head } from 'lodash'
import $ from 'jquery'
import moment from 'moment'

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

    console.log(moment().format('YYYY-MM-DD'))
  }
}
</script>
