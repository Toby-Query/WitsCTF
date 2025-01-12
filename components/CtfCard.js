const CtfCard = ({ title, points, solved }) => {
  // alert("solved: " + solved);
  return (
    <div
      className={`card w-96 shadow-xl ${
        solved ? "bg-green-500" : "bg-base-100"
      }`}
    >
      <div className="card-body flex justify-center items-center">
        <h2 className="card-title">{title}</h2>
        <p>{points}</p>
        {solved && (
          <span className="badge badge-success absolute top-2 right-2">
            Solved
          </span>
        )}
      </div>
    </div>
  );
};

export default CtfCard;
