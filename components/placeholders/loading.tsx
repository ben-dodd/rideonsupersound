import Image from 'next/image'

const Loading = ({
  size = 'md',
  type = 'spin',
}: {
  size?: 'full' | 'md' | 'sm'
  type?: 'ripple' | 'spin' | 'pyramid'
}) => {
  return (
    <div
      className={`flex justify-center align-center ${
        size === 'full' ? 'h-screen w-screen' : size === 'md' ? 'h-full w-full' : 'h-full w-full'
      }`}
    >
      {type === 'ripple' ? (
        <div className="lds-ripple">
          <div />
          <div />
        </div>
      ) : type === 'spin' ? (
        <div className="loading-icon" />
      ) : (
        <Image
          className="m-auto inline-block"
          src={`${process.env.NEXT_PUBLIC_RESOURCE_URL}img/loading.gif`}
          alt="Loading"
          width={200}
          height={200}
        />
      )}
    </div>
  )
}

export default Loading
