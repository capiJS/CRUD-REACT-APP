import darthImage from "../assets/starwars.jpg";

export default function Home() {
  return (
    <div>
      <img
        style={{
          position: "absolute",
          width: "100%",
          height: "auto",
          maxWidth: "100vw",
          maxHeight: "90vh",
        }}
        src={darthImage}
        alt="imagen de darth vader"
      />
    </div>
  );
}
