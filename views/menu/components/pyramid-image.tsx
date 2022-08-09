export default function PyramidImage() {
  return (
    <div className="px-8">
      <div className="hover:animate-wiggle">
        <img
          src={`${process.env.NEXT_PUBLIC_RESOURCE_URL}img/pyramid.png`}
          alt="Ride On Super Sound"
          width={500}
          height={530}
        />
      </div>
    </div>
  )
}
