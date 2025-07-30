import React from "react";
import styled, {css} from "styled-components";

// --- Styled Components ---
const ScoresheetWrapper = styled.div`
  box-sizing: border-box;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  width: 350px;
  height: 1080px;
`;

const Scoresheet = styled.div`
  background-image: url('/images/score-sheet.jpg');
  background-repeat:no-repeat;
  background-size:cover;   
  height: 970px; 
  z-index: 10;
`;

const scoreStyles = {
  Aces: css`
    top: 127px;
  `,
  Twos: css`
    top: 174px;
  `,
  Threes: css`
    top: 221px;
  `,
  Fours: css`
    top: 268px;
  `,
  Fives: css`
    top: 316px;
  `,
  Sixes: css`
    top: 363px;
  `,
  ThreeOfAKind: css`
    top: 562px;
    height: 34px;
  `,
  FourOfAKind: css`
    top: 602px;
    height: 34px;
  `,
  FullHouse: css`
    top: 642px;
    height: 34px;
  `,
  SmStraight: css`
    top: 682px;
    height: 34px;
  `,
  LgStraight: css`
    top: 722px;
    height: 34px;
  `,
  Yahtzee: css`
    top: 762px;
    height: 34px;
  `,
  Chance: css`
    top: 802px;
    height: 34px;
  `,
  
  
  
  // Add other custom styles per category...
};

const totalStyles = {
  UpperNoBonus: css`
    top: 412px;
    width: 59px;
    height: 34px;
    border: 1px solid #ccc;
  `,
  Bonus: css`
    top: 450px;
    width: 59px;
    height: 34px;
    border: 1px solid #ccc;
  `,
  Upper: css`
    top: 489px;
    width: 59px;
    height: 34px;
    border: 1px solid #ccc;
  `,
  TotalLower: css`
    top: 842px;
    left: 165px;
    width:177px;
    height: 41px;
    border: 3px solid black;
  `,
  TotalUpper: css`
    top: 890px;
    left: 165px;
    width:177px;
    height: 41px;
    border: 3px solid black;
  `,
  Total: css`
    top: 937px;
    left: 165px;
    width:177px;
    height: 41px;
    font-size: xx-large;
    font-weight: bold;
    border: 3px solid black;
  `,
}
/* Transient Props (with $ prefix) are necessary here to avoid warnings from react. They are used internally for styling but not forwarded to the actual DOM */
const ScoreCell = styled.span`
  position: absolute;
  left: 287px;
  width: 59px;
  height: 41px;
  display: inline-block;
  font-size: x-large;
  font-style: italic;
  text-align: center;
  padding-top: 5px;
  cursor: pointer;
  border: 1px solid #ccc;
  
  ${({ $taken }) => $taken && css`background-color: lightgreen;cursor:not-allowed;`}

  ${({ $category }) => scoreStyles[$category] || ''}
`;

const TotalCell = styled.span`
  position: absolute;
  left: 287px;
  display: inline-block;
  font-size: x-large;
  font-style: italic;
  text-align: center;
  padding-top: 5px;
  cursor: pointer;

  ${({ $category }) => totalStyles[$category] || ''}
`;

// --- React Component ---

class ScoreSheet extends React.Component {
    
  constructor(props) {
      super(props);
      this.state = { confirmedScore: props.confirmedScoreArray };   
  }

  componentDidUpdate(prevProps) {  // handle updates from parent components
    
    const { confirmedScoreArray, scoreArray } = this.props;

    if (!confirmedScoreArray || !scoreArray) {
      console.error("Score arrays are not provided or invalid.");
      return; // Or render a fallback UI
    }

    if (prevProps.confirmedScoreArray !== this.props.confirmedScoreArray) {
      this.setState({ confirmedScore: confirmedScoreArray });
    }
    
  }

  handleClick = (el) => {
    const { lockScore } = this.props;

    if (lockScore) return //if the scoresheet is locked, just exit the function

    const newVal = new Map([...this.props.confirmedScoreArray])      
    newVal.set(el.target.id,parseInt(el.target.textContent))
    const recalculatedArray = this.calculateTotal(newVal)
    this.setState({
      confirmedScore: recalculatedArray
    }, () => { this.props.onChangeScore(this.state.confirmedScore) } //callback 
    );
  }

  calculateTotal = (mapScoreArray) => {
    //UPPER SECTION
    const Aces = mapScoreArray.get("Aces") ?? 0
    const Twos = mapScoreArray.get("Twos") ?? 0
    const Threes = mapScoreArray.get("Threes") ?? 0
    const Fours = mapScoreArray.get("Fours") ?? 0
    const Fives = mapScoreArray.get("Fives") ?? 0
    const Sixes = mapScoreArray.get("Sixes") ?? 0
    //
    const UpperNoBonus =   Aces + Twos + Threes + Fours + Fives + Sixes      
    mapScoreArray.set("UpperNoBonus",UpperNoBonus)
    //Set bonus
    const bonus = (UpperNoBonus >= 63) ? 35 : 0      
    mapScoreArray.set("Bonus",bonus)
    //Set TotalUpper
    const totalUpper = parseInt(mapScoreArray.get("UpperNoBonus")) + parseInt(mapScoreArray.get("Bonus"))
    mapScoreArray.set("Upper",totalUpper)
    
    //LOWER SECTION
    const ThreeOfAKind = mapScoreArray.get("ThreeOfAKind") ?? 0
    const FourOfAKind = mapScoreArray.get("FourOfAKind") ?? 0
    const FullHouse = mapScoreArray.get("FullHouse") ?? 0
    const SmStraight = mapScoreArray.get("SmStraight") ?? 0
    const LgStraight = mapScoreArray.get("LgStraight") ?? 0
    const Yahtzee = mapScoreArray.get("Yahtzee") ?? 0
    const Chance = mapScoreArray.get("Chance") ?? 0
    //Set TotalLower
    const totalLower =   ThreeOfAKind + FourOfAKind + FullHouse + SmStraight + LgStraight + Yahtzee + Chance 
    mapScoreArray.set("TotalLower",totalLower)
    mapScoreArray.set("TotalUpper",totalUpper)
    //Set Total
    mapScoreArray.set("Total",(totalUpper+totalLower))
    //
    return mapScoreArray
  }

  renderScore = (id) => {
    const confirmed = this.state.confirmedScore.get(id);
    const proposed = this.props.scoreArray.get(id);
    return (
      <ScoreCell
        id={id}
        $category={id}
        onClick={this.handleClick}
        $taken={!isNaN(confirmed)}
      >
        {confirmed ?? proposed}
      </ScoreCell>
    );
  };

  renderTotal = (id) => {
    const confirmed = this.state.confirmedScore.get(id);
    const proposed = this.props.scoreArray.get(id);
    return (
      <TotalCell
        id={id}
        $category={id}
      >
        {confirmed ?? proposed}
      </TotalCell>
    );
  };

  render() {      
    return (
      <ScoresheetWrapper>
        <Scoresheet>
          {this.renderScore("Aces")}
          {this.renderScore("Twos")}
          {this.renderScore("Threes")}
          {this.renderScore("Fours")}
          {this.renderScore("Fives")}
          {this.renderScore("Sixes")}
          {this.renderTotal("UpperNoBonus")}
          {this.renderTotal("Bonus")}
          {this.renderTotal("Upper")}
          {this.renderScore("ThreeOfAKind")}
          {this.renderScore("FourOfAKind")}
          {this.renderScore("FullHouse")}
          {this.renderScore("SmStraight")}
          {this.renderScore("LgStraight")}
          {this.renderScore("Yahtzee")}
          {this.renderScore("Chance")}
          {this.renderTotal("TotalLower")}
          {this.renderTotal("TotalUpper")}
          {this.renderTotal("Total")}
        </Scoresheet>
      </ScoresheetWrapper>
    );
  }
}

export default ScoreSheet