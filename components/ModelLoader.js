import { forwardRef } from 'react'

export const Loading = () => <p>Loading</p>

export const ModelLoader = forwardRef(({ children }, ref) => (
  <div
    ref={ref}
    className='andrew-voxel'
    style={{
      margin: 'auto',
      position: 'relative',
      width: '470px',
      height: '470px'
    }}
  >
    {children}
  </div>
))

const Loader = () => {
  return(
    <ModelLoader>
      <Loading />
    </ModelLoader>
  )
}

export default Loader
