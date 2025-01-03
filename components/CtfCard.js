const CtfCard = ({ title, points }) => {
  return (
    <div class="card bg-base-100 w-96 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">{title}</h2>
        <p>{points}</p>
        {/* <div class="card-actions justify-end">
          <button class="btn btn-primary">Buy Now</button>
        </div> */}
      </div>
    </div>
  );
};

export default CtfCard;
