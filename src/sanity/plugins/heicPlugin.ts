import { definePlugin, type InputProps } from 'sanity'
import { HeicImageInput } from '../components/HeicImageInput'

export const heicPlugin = definePlugin({
  name: 'heic-conversion',
  form: {
    components: {
      input: (props: InputProps) => {
        if (props.schemaType.name === 'image') {
          return HeicImageInput(props as any)
        }
        return props.renderDefault(props)
      },
    },
  },
})
