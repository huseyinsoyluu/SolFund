import cause1 from './images/afghanistan.jpg';
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import userAddress from './userAddress';
import { FUNDRAISER_ADDRESS, FUNDRAISER_ABI } from './config.js';

import {
  Link,
  Switch,
  Route,
  BrowserRouter as Router,
} from 'react-router-dom';

const Cause1 = ({ props }) => {
  const [cause1Title, setCause1Title] = useState();
  const [cause1Desc, setCause1Desc] = useState();
  const [targetAmount, setTargetAmount] = useState();
  const [donatedAmount, setDonatedAmount] = useState();

  const [toDonate, setToDonate] = useState();

  useEffect(() => {
    async function load() {
      const provider = new ethers.providers.JsonRpcProvider(
        'http://localhost:7545'
      );

      const contract = new ethers.Contract(
        FUNDRAISER_ADDRESS,
        FUNDRAISER_ABI,
        provider
      );

      const causeNames = await contract.getCauseNames();
      setCause1Title(String(causeNames[0]));

      const desc1 = String(await contract.getCauseDesc(cause1Title));
      setCause1Desc(String(desc1));

      const target = await contract.getCauseTargetAmount(cause1Title);
      const donated = await contract.getCauseDonatedAmount(
        cause1Title
      );

      setTargetAmount(String(target));
      setDonatedAmount(String(donated));
    }

    load();
  }, []);

  function updateAmount(event) {
    setToDonate(event.target.value);
  }

  function donateAmount(event) {
    async function load() {
      const provider = new ethers.providers.JsonRpcProvider(
        'http://localhost:7545'
      );
      const signer = provider.getSigner(userAddress.value);

      const contract = new ethers.Contract(
        FUNDRAISER_ADDRESS,
        FUNDRAISER_ABI,
        signer
      );

      console.log(userAddress.value);
      console.log(toDonate);
      const var_ = await contract.donateToCause(cause1Title, {
        value: ethers.utils.parseEther(toDonate),
        from: userAddress.value,
      });
    }

    load();
  }

  return (
    <div className="donate">
      <header className="header-cause">
        <img src={cause1} className="img-cause" />
        {cause1Title}
        <p className="p-cause">{cause1Desc}</p>
        <p className="space">Empty space1</p>

        <p className="target-amount">
          Target Amount = {targetAmount} SOL
        </p>

        <p className="current-amount">
          Current Donations = {donatedAmount} SOL
        </p>

        <div className="form">
          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input
              type="amount"
              name="amount"
              placeholder="amount"
              onChange={updateAmount}
            />
          </div>
        </div>

        <button type="button" className="donate-btn">
          <Link to="/popup" onClick={donateAmount}>
            Donate
          </Link>
        </button>
      </header>
    </div>
  );
};

export default Cause1;
