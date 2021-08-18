import AddIcon from "@material-ui/icons/Add";

export default function GiftCardItem() {
  return (
    <div className="flex w-full mb-2 bg-blue-100">
      <img className="w-32 h-32" src={"/img/giftCard.png"} alt={"GiftCard"} />
      <div className="ml-2">
        <div className="font-bold">GIFT CARD</div>
        <div className="text-xs">Click to create new gift card</div>
      </div>
      <div className="self-center px-2 w-1/5">
        <button className="icon-button-large" onClick={null}>
          <AddIcon style={{ fontSize: "40px" }} />
        </button>
      </div>
    </div>
  );
}
