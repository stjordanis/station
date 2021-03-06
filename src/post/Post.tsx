import React from 'react'
import { useInfo, PostPage } from '../use-station/src'
import { useApp } from '../hooks'
import Form, { Props as FormProps } from '../components/Form'
import ModalContent from '../components/ModalContent'
import Confirm from '../components/Confirm'
import ProgressCircle from '../components/ProgressCircle'
import Confirmation from './Confirmation'

interface Props {
  post: PostPage
  formProps?: Partial<FormProps>
}

const Post = ({ post, formProps }: Props) => {
  const { error, loading, submitted, form, confirm } = post
  const { modal } = useApp()
  const { ERROR } = useInfo()

  return error ? (
    <ModalContent close={modal.close}>
      <Confirm {...ERROR} />
    </ModalContent>
  ) : loading ? (
    <ProgressCircle center />
  ) : !submitted ? (
    <ModalContent close={modal.close}>
      {form && <Form form={form} {...formProps} />}
    </ModalContent>
  ) : confirm ? (
    <Confirmation confirm={confirm} modal={modal} />
  ) : null
}

export default Post
