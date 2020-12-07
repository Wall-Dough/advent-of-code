function getPassportTexts() {
    return getInput().split(/\r?\n\r?\n/);
}

function getPassports() {
    return getPassportTexts().map(function (value) {
        var matches = value.match(/([a-z]{3}:\S+)/g);
        var dict = {};
        matches.map(function (v) {
            var keyVal = v.match(/([a-z]{3}):(\S+)/);
            dict[keyVal[1]] = keyVal[2];
        })
        return dict;
    });
}

function solve_day4_part1() {
    var expectedFields = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"]
    var passports = getPassports();
    var valid = passports.filter(function (passport) {
        for (field of expectedFields) {
            if (!passport[field]) {
                return false;
            }
        }
        return true;
    });
    console.log(valid);
    return valid.length;
}

addSolution(4, 1, solve_day4_part1, true);

function isFourDigits(numStr) {
    return numStr.length == 4 && numStr.match(/[0-9]{4}/) != null;
}

function solve_day4_part2() {
    var expectedFields = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"]
    var passports = getPassports();
    var valid = passports.filter(function (passport) {
        for (field of expectedFields) {
            if (!passport[field]) {
                return false;
            }
        }
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
        var centi = passport.hgt.match(/([0-9]+)cm/);
        var inch = passport.hgt.match(/([0-9]+)in/);
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
        var hairColor = passport.hcl.match(/\#[0-9|a-f]{6}/);
        if (hairColor == null || hairColor[0].length != passport.hcl.length) {
            return false;
        }
        // ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
        var eyeColors = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"];
        if (!eyeColors.includes(passport.ecl)) {
            return false;
        }
        // pid (Passport ID) - a nine-digit number, including leading zeroes.
        var pid = passport.pid.match(/[0-9]{9}/);
        if (pid == null || pid[0].length != passport.pid.length) {
            return false;
        }
        // cid (Country ID) - ignored, missing or not.
        return true;
    });
    console.log(valid);
    return valid.length;
}

addSolution(4, 2, solve_day4_part2);
