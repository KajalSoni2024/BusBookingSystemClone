export const getters = {
    getBusSeatWithIsSelectedOption(state){
        console.log("sdgfrgtrg");
      const seats = state.busSeatsByBusId.map((seat)=>{
        return {...seat , isSelected:false}
      });
      return seats;
    }
};
