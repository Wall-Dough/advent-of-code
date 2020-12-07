const fs = require('fs');
const assert = require('assert');

const toDictionaries = (passports) => {
    return passports.map((value) => {
        const matches = value.match(/([a-z]{3}:\S+)/g);
        const dict = {};
        matches.forEach((v) => {
            var keyVal = v.match(/([a-z]{3}):(\S+)/);
            dict[keyVal[1]] = keyVal[2];
        });
        return dict;
    });
};

const expectedFields = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"];
const filterValid = (passports) => {
    return passports.filter((passport) => {
        for (field of expectedFields) {
            if (!passport[field]) {
                return false;
            }
        }
        return true;
    });
};

const part1 = (passports) => {
    return filterValid(toDictionaries(passports)).length;
};

const isFourDigits = (numStr) => {
    return numStr.length == 4 && numStr.match(/[0-9]{4}/) != null;
};

const eyeColors = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"];
const part2 = (passports) => {
    return filterValid(toDictionaries(passports)).filter(function (passport) {
        // byr (Birth Year) - four digits; at least 1920 and at most 2002.
        if (!isFourDigits(passport.byr) || parseInt(passport.byr) < 1920
                || parseInt(passport.byr) > 2002) {
            return false;
        }
        // iyr (Issue Year) - four digits; at least 2010 and at most 2020.
        if (!isFourDigits(passport.iyr) || parseInt(passport.iyr) < 2010
                || parseInt(passport.iyr) > 2020) {
            return false;
        }
        // eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
        if (!isFourDigits(passport.eyr) || parseInt(passport.eyr) < 2020
                || parseInt(passport.eyr) > 2030) {
            return false;
        }
        // hgt (Height) - a number followed by either cm or in:
        const centi = passport.hgt.match(/([0-9]+)cm/);
        const inch = passport.hgt.match(/([0-9]+)in/);
        if (centi) {
            // If cm, the number must be at least 150 and at most 193.
            if (passport.hgt.length != 5 || parseInt(centi) < 150 || parseInt(centi) > 193) {
                return false;
            }
        } else if (inch) {
            // If in, the number must be at least 59 and at most 76.
            if (passport.hgt.length != 4 || parseInt(inch) < 59 || parseInt(inch) > 76) {
                return false;
            }
        } else {
            return false;
        }
        // hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
        const hairColor = passport.hcl.match(/\#[0-9|a-f]{6}/);
        if (hairColor == null || hairColor[0].length != passport.hcl.length) {
            return false;
        }
        // ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
        if (!eyeColors.includes(passport.ecl)) {
            return false;
        }
        // pid (Passport ID) - a nine-digit number, including leading zeroes.
        const pid = passport.pid.match(/[0-9]{9}/);
        if (pid == null || pid[0].length != passport.pid.length) {
            return false;
        }
        // cid (Country ID) - ignored, missing or not.
        return true;
    }).length;
};

const example = `ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
byr:1937 iyr:2017 cid:147 hgt:183cm

iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884
hcl:#cfa07d byr:1929

hcl:#ae17e1 iyr:2013
eyr:2024
ecl:brn pid:760753108 byr:1931
hgt:179cm

hcl:#cfa07d eyr:2025 pid:166559648
iyr:2011 ecl:brn hgt:59in`.trim().split(/\r?\n\r?\n/);

const allInvalid = `eyr:1972 cid:100
hcl:#18171d ecl:amb hgt:170 pid:186cm iyr:2018 byr:1926

iyr:2019
hcl:#602927 eyr:1967 hgt:170cm
ecl:grn pid:012533040 byr:1946

hcl:dab227 iyr:2012
ecl:brn hgt:182cm pid:021572410 eyr:2020 byr:1992 cid:277

hgt:59cm ecl:zzz
eyr:2038 hcl:74454a iyr:2023
pid:3556412378 byr:2007`.trim().split(/\r?\n\r?\n/);

const allValid = `pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980
hcl:#623a2f

eyr:2029 ecl:blu cid:129 byr:1989
iyr:2014 pid:896056539 hcl:#a97842 hgt:165cm

hcl:#888785
hgt:164cm byr:2001 iyr:2015 cid:88
pid:545766238 ecl:hzl
eyr:2022

iyr:2010 hgt:158cm hcl:#b6652a ecl:blu byr:1944 eyr:2021 pid:093154719`.trim().split(/\r?\n\r?\n/);

assert.strictEqual(part1(example), 2);
assert.strictEqual(part2(allInvalid), 0);
assert.strictEqual(part2(allValid), allValid.length);

const passports = fs.readFileSync('./input.txt', 'utf8').trim().split(/\r?\n\r?\n/);

console.log(`Part 1: ${part1(passports)}`);
console.log(`Part 2: ${part2(passports)}`);
