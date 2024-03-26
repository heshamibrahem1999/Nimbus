import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl,FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { CountryCodeService } from '../../Services/country-code.service';
import { CountryCode } from '../../Modules/country-code';
import { UniversityInfoInterface } from '../../Modules/university-info-interface';
import { UserInterface } from '../../Modules/user-interface';
import { UserLoginDataServicesService } from '../../Services/user-login-data-services.service';
import { IpServerService } from '../../Services/ip-server.service';
import Fingerprint2 from 'fingerprintjs2';
import { Router } from '@angular/router';
import { SavedProductsService } from '../../Services/saved-products.service';
import { CartBoughtProductsService } from '../../Services/cart-bought-products.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent implements OnInit{
  AccountInfo = new FormGroup({
    FirstName: new FormControl('', Validators.required),
    MaidenName: new FormControl('', Validators.required),
    LastName: new FormControl('', Validators.required),
    Gender: new FormControl('', Validators.required),
    Email: new FormControl('', [Validators.required, Validators.email]),
    ConfirmEmail: new FormControl('', [Validators.required, this.matchEmails.bind(this)]),
    Country: new FormControl('', Validators.required),
    Phone: new FormControl('', Validators.required),
    UserName: new FormControl('', Validators.required),
    Password: new FormControl('', [Validators.required, this.passwordValidator()]),
    ConfirmPassword: new FormControl('', [Validators.required, this.matchPasswords.bind(this)]),
    BirthDate: new FormControl('', Validators.required),
    Image: new FormControl('', Validators.required),
    University: new FormControl('', Validators.required)
  });
  PhyAttribute = new FormGroup({
    BloodGroup: new FormControl('', Validators.required),
    Height: new FormControl('', Validators.required),
    Weight: new FormControl('', Validators.required),
    EyeColor: new FormControl('#000000', Validators.required),
    HairColor : new FormControl('#000000', Validators.required),
    HairType : new FormControl('', Validators.required)
  })
  Address= new FormGroup({
    Domain: new FormControl('', [this.domainValidator()]),
    Address: new FormControl('', Validators.required),
    City: new FormControl('', Validators.required),
    PostalCode: new FormControl('', Validators.required),
    State: new FormControl('', Validators.required)
  })
  Bank= new FormGroup({
    CardExpireMonth: new FormControl('', [Validators.required, Validators.pattern('^(0?[1-9]|1[0-2])$')]),
    CardExpireYear: new FormControl('', [Validators.required, Validators.pattern('^([0-9]{2})$')]),
    CardNumber: new FormControl('', [Validators.required, this.cardNumberValidator()]),
    CardType: new FormControl('', Validators.required),
    Currency: new FormControl('', Validators.required),
    Iban: new FormControl('', Validators.required)
  })
  Countries:string[] = [];
  CountryCodes:string = ""; 
  Universities:UniversityInfoInterface[]= [];
  currencies: any[];
  accountInfoComplete = false;
  phyAttributeComplete = false;
  addressComplete = false;
  bankComplete = false;
  UserSignUpInfo:UserInterface={} as UserInterface;
  IpAddress: string = '';
  latitude: number | undefined = 0;
  longitude: number | undefined = 0;
  errorMessage: string | undefined;
  constructor(private CountryCodeService:CountryCodeService,
    private UsersInfo:UserLoginDataServicesService,
    private IpServer:IpServerService,
    private UserSaves:SavedProductsService,
    private UserCart:CartBoughtProductsService,
    private Route:Router){
    this.currencies = [
      { name: 'US Dollar', code: 'USD' },
      { name: 'Euro', code: 'EUR' }
    ];
  }

  
  ngOnInit(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
        },
        error => {
          switch(error.code) {
            case error.PERMISSION_DENIED:
              this.errorMessage = "User denied the request for Geolocation.";
              break;
            case error.POSITION_UNAVAILABLE:
              this.errorMessage = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              this.errorMessage = "The request to get user location timed out.";
              break;
          }
        }
      );
    } else {
      this.errorMessage = "Geolocation is not supported by this browser.";
    }
    this.IpServer.getIpAddress().then(ip => {
      this.IpAddress = ip;
      // Any other code that relies on the IP address can go here
    }).catch(error => {
      console.error('Error fetching IP address:', error);
      this.IpAddress = '';
    });
    this.UsersInfo.UsersData.subscribe(
      (UsersData) => {
        this.UserSignUpInfo.id= (UsersData.length +1).toString();
      }
    )
    this.CountryCodeService.AllCountries().subscribe(
      (CountryInfo)=>{
        this.Countries = this.GetCountriesFromObject(CountryInfo);
      }
    )
    this.AccountInfo.valueChanges.subscribe(() => {
      this.accountInfoComplete = this.isAccountInfoComplete();
    });

    this.PhyAttribute.valueChanges.subscribe(() => {
      this.phyAttributeComplete = this.isPhyAttributeComplete();
    });

    this.Address.valueChanges.subscribe(() => {
      this.addressComplete = this.isAddressComplete();
    });

    this.Bank.valueChanges.subscribe(() => {
      this.bankComplete = this.isBankComplete();
    });
  }

  isAccountInfoComplete(): boolean {
    return this.AccountInfo.valid;
  }

  // Function to check if all fields in Phy Attribute accordion are filled
  isPhyAttributeComplete(): boolean {
    return this.PhyAttribute.valid;
  }

  // Function to check if all fields in Address accordion are filled
  isAddressComplete(): boolean {
    return this.Address.valid;
  }

  // Function to check if all fields in Bank accordion are filled
  isBankComplete(): boolean {
    return this.Bank.valid;
  }

  matchPasswords(control: FormControl): { [key: string]: boolean } | null {
    const password = control.root.get('Password')?.value;
    const confirmPassword = control.value;
    
    return password !== confirmPassword ? { passwordMismatch: true } : null;
  }

  matchEmails(control: FormControl): { [key: string]: boolean } | null {
    const email = control.root.get('Email')?.value;
    const confirmEmail = control.value;
    
    return email !== confirmEmail ? { emailMismatch: true } : null;
  }

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const passwordPattern: RegExp = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
      if (control.value && !passwordPattern.test(control.value)) {
        return { invalidPasswordPattern: true };
      }
      return null;
    };
  }

  domainValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const domainPattern: RegExp = /^(?:[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*\.)+[a-zA-Z]{2,}$/;
      if (control.value && !domainPattern.test(control.value)) {
        return { invalidDomainPattern: true };
      }
      return null;
    };
  }

  cardNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const cardNumberPattern: RegExp = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
      if (control.value && !cardNumberPattern.test(control.value)) {
        return { invalidCardNumberPattern: true };
      }
      return null;
    };
  }

  GetCountriesFromObject(ObjectList:CountryCode[]){
    let Countries:string[]=[];
    for (let CountryInfo of ObjectList){
      Countries.push(CountryInfo.name)
    }
    return Countries;
  }

  GetCountryCodeAndUniversities(Country:string){
    if(Country){
      this.CountryCodeService.GetCountryCode(Country).subscribe(
        (CountryInfo)=>{
          this.CountryCodes = CountryInfo[0].dial_code;
        }
      );
      this.CountryCodeService.GetCountryUniversities(Country).subscribe(
        (Universities)=>{
          this.Universities = Universities;
        }
      )
    }
  }

  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let matches = value.match(/\d{4,16}/g);
    let match = matches && matches[0] || '';
    let parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      event.target.value = parts.join('-');
    } else {
      event.target.value = value;
    }

    this.Bank.patchValue({
      CardNumber: event.target.value
    });
  }

  getUserId(): string {
    // Check if the user has a stored ID in local storage
    let userId:string|null = ""
    if (localStorage.getItem('userId')){
      userId = localStorage.getItem('userId');
    }
    if (!userId) {
      // If not, generate a new fingerprint
      Fingerprint2.get((components) => {
        const values = components.map((component) => component.value);
        const fingerprint = Fingerprint2.x64hash128(values.join(''), 31);
        // Store the fingerprint in local storage
        localStorage.setItem('userId', fingerprint);
        userId = fingerprint;
      });
    }
    return userId!;
  }

  onSubmit() {
    if (this.AccountInfo.valid && this.PhyAttribute.valid && this.Address.valid && this.Bank.valid) {
      this.UserSignUpInfo.firstName = this.AccountInfo.get('FirstName')?.value!;
      this.UserSignUpInfo.maidenName = this.AccountInfo.get('MaidenName')?.value!;
      this.UserSignUpInfo.lastName = this.AccountInfo.get('LastName')?.value!;
      this.UserSignUpInfo.birthDate = this.AccountInfo.get('BirthDate')?.value!;
      this.UserSignUpInfo.age = new Date().getFullYear() - new Date(this.UserSignUpInfo.birthDate).getFullYear();
      this.UserSignUpInfo.gender = this.AccountInfo.get('Gender')?.value!;
      this.UserSignUpInfo.email = this.AccountInfo.get('Email')?.value!;
      this.UserSignUpInfo.phone = `${this.CountryCodes} ${this.AccountInfo.get('Phone')?.value!}`;
      this.UserSignUpInfo.username = this.AccountInfo.get('UserName')?.value!;
      this.UserSignUpInfo.password = this.AccountInfo.get('Password')?.value!;
      this.UserSignUpInfo.image = this.AccountInfo.get('Image')?.value!;
      this.UserSignUpInfo.bloodGroup = this.PhyAttribute.get('BloodGroup')?.value!;
      this.UserSignUpInfo.height = +this.PhyAttribute.get('Height')?.value!;
      this.UserSignUpInfo.weight = +this.PhyAttribute.get('Weight')?.value!;
      this.UserSignUpInfo.eyeColor = this.PhyAttribute.get('EyeColor')?.value!;
      this.UserSignUpInfo.hair = {color:this.PhyAttribute.get('HairColor')?.value!,type: this.PhyAttribute.get('HairType')?.value!};
      this.UserSignUpInfo.domain = this.Address.get('Domain')?.value!;
      this.UserSignUpInfo.ip = this.IpAddress;
      this.UserSignUpInfo.address = {
        address: this.Address.get('Address')?.value!,
        city: this.Address.get('City')?.value!,
        coordinates: {
          lat: this.latitude!,
          lng: this.longitude!
        },
        postalCode: this.Address.get('PostalCode')?.value!,
        state: this.Address.get('State')?.value!
      };
      this.UserSignUpInfo.macAddress = this.getUserId();
      this.UserSignUpInfo.university = this.AccountInfo.get('University')?.value!;
      this.UserSignUpInfo.bank = {
        cardExpire: `${this.Bank.get('CardExpireMonth')?.value!}/${this.Bank.get('CardExpireYear')?.value!}`,
        cardNumber: this.Bank.get('CardNumber')?.value!,
        cardType: this.Bank.get('CardType')?.value!,
        currency: this.Bank.get('Currency')?.value!,
        iban: this.Bank.get('Iban')?.value!
      };
      this.UserSignUpInfo.company = {
        address: {
          address: "",
          city: "",
          coordinates: {
            lat: 0,
            lng: 0
          },
          postalCode: "",
          state: ""
        },
        department: "",
        name: "",
        title: ""
      };
      this.UserSignUpInfo.ein = "";
      this.UserSignUpInfo.ssn = "";
      this.UserSignUpInfo.userAgent = "";
      this.UserSignUpInfo.crypto = {
        coin: "",
        wallet: "",
        network: ""
      };
      this.UsersInfo.UserSignIn(this.UserSignUpInfo).subscribe(
        (data)=>{
          localStorage.setItem('currentUser', JSON.stringify(this.UserSignUpInfo));
          this.UserSaves.AddNewUserSaves(this.UserSignUpInfo.id.toString()).subscribe(
            ()=>{
              this.UserCart.AddNewUserCart(this.UserSignUpInfo.id.toString()).subscribe(
                ()=>{
                  this.Route.navigate(['/']);
                }
              )
            }
          )
        });
    } else {
      console.log("Form is invalid");
    }
  }
}
